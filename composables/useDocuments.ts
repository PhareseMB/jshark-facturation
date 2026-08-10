import type { Database, DocumentStatut, DocumentType } from '~/types/database.types'
import { calcTotaux } from '~/utils/totals'

export interface LigneInputDraft {
  description: string
  quantite: number
  prix_unitaire: number
}

export interface DocumentDraftInput {
  id?: string
  type: DocumentType
  client: { id?: string; nom: string; adresse?: string | null; email?: string | null }
  date_emission: string
  date_echeance: string | null
  taux_tva: number
  notes: string
  statut: DocumentStatut
  lignes: LigneInputDraft[]
  converti_depuis_id?: string | null
}

export interface DocumentWithRelations {
  id: string
  type: DocumentType
  numero: string
  client_id: string
  date_emission: string
  date_echeance: string | null
  taux_tva: number
  notes: string | null
  statut: DocumentStatut
  total_ht: number
  total_ttc: number
  converti_depuis_id: string | null
  created_at: string
  updated_at: string
  client: { id: string; nom: string; adresse: string | null; email: string | null }
  lignes: { id: string; description: string; quantite: number; prix_unitaire: number; position: number }[]
}

export interface DocumentListItem {
  id: string
  type: DocumentType
  numero: string
  date_emission: string
  date_echeance: string | null
  taux_tva: number
  statut: DocumentStatut
  total_ht: number
  total_ttc: number
  client: { id: string; nom: string }
}

export interface DocumentFilters {
  type?: DocumentType | ''
  statut?: DocumentStatut | ''
  annee?: number | ''
  clientQuery?: string
}

export function useDocuments() {
  const supabase = useSupabaseClient<Database>()
  const { findOrCreateClient } = useClients()
  const { nextNumero } = useDocumentNumbering()

  async function getDocumentById(id: string): Promise<DocumentWithRelations> {
    // Le client Supabase typé n'infère pas les embeds relationnels (client:…, lignes:…)
    // faute de `Relationships` générées : on caste explicitement vers la forme connue.
    const { data, error } = await supabase
      .from('documents')
      .select('*, client:clients(*), lignes:document_lignes(*)')
      .eq('id', id)
      .order('position', { referencedTable: 'document_lignes' })
      .single()
    if (error) throw error
    return data as unknown as DocumentWithRelations
  }

  async function replaceLignes(documentId: string, lignes: LigneInputDraft[]) {
    const { error: deleteError } = await supabase.from('document_lignes').delete().eq('document_id', documentId)
    if (deleteError) throw deleteError

    const rows = lignes.map((ligne, index) => ({
      document_id: documentId,
      description: ligne.description,
      quantite: ligne.quantite,
      prix_unitaire: ligne.prix_unitaire,
      position: index,
    }))

    const { error: insertError } = await supabase.from('document_lignes').insert(rows)
    if (insertError) throw insertError
  }

  async function createDocument(input: DocumentDraftInput) {
    const client = await findOrCreateClient(input.client)
    const annee = new Date(input.date_emission).getFullYear()
    const numero = await nextNumero(input.type, annee)
    const { totalHT, totalTTC } = calcTotaux(input.lignes, input.taux_tva)

    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        type: input.type,
        numero,
        client_id: client.id,
        date_emission: input.date_emission,
        date_echeance: input.date_echeance,
        taux_tva: input.taux_tva,
        notes: input.notes,
        statut: input.statut,
        total_ht: totalHT,
        total_ttc: totalTTC,
        converti_depuis_id: input.converti_depuis_id ?? null,
      })
      .select()
      .single()
    if (error) throw error

    await replaceLignes(document.id, input.lignes)

    return getDocumentById(document.id)
  }

  async function updateDocument(id: string, input: DocumentDraftInput) {
    const client = await findOrCreateClient(input.client)
    const { totalHT, totalTTC } = calcTotaux(input.lignes, input.taux_tva)

    const { error } = await supabase
      .from('documents')
      .update({
        client_id: client.id,
        date_emission: input.date_emission,
        date_echeance: input.date_echeance,
        taux_tva: input.taux_tva,
        notes: input.notes,
        statut: input.statut,
        total_ht: totalHT,
        total_ttc: totalTTC,
      })
      .eq('id', id)
    if (error) throw error

    await replaceLignes(id, input.lignes)

    return getDocumentById(id)
  }

  async function listDocuments(filters: DocumentFilters = {}): Promise<DocumentListItem[]> {
    let query = supabase
      .from('documents')
      .select('id, type, numero, date_emission, date_echeance, taux_tva, statut, total_ht, total_ttc, client:clients(id, nom)')
      .order('date_emission', { ascending: false })
      .order('numero', { ascending: false })

    if (filters.type) query = query.eq('type', filters.type)
    if (filters.statut) query = query.eq('statut', filters.statut)
    if (filters.annee) {
      query = query.gte('date_emission', `${filters.annee}-01-01`).lte('date_emission', `${filters.annee}-12-31`)
    }

    const { data, error } = await query
    if (error) throw error

    let documents = data as unknown as DocumentListItem[]

    if (filters.clientQuery?.trim()) {
      const needle = filters.clientQuery.trim().toLowerCase()
      documents = documents.filter((d) => d.client.nom.toLowerCase().includes(needle))
    }

    return documents
  }

  async function deleteDocument(id: string) {
    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) throw error
  }

  async function updateStatut(id: string, statut: DocumentStatut) {
    const { error } = await supabase.from('documents').update({ statut }).eq('id', id)
    if (error) throw error
  }

  /** Génère une nouvelle facture (brouillon) pré-remplie à partir d'un devis accepté. */
  async function convertDevisToFacture(devisId: string) {
    const devis = await getDocumentById(devisId)

    return createDocument({
      type: 'facture',
      client: {
        id: devis.client.id,
        nom: devis.client.nom,
        adresse: devis.client.adresse,
        email: devis.client.email,
      },
      date_emission: todayISO(),
      date_echeance: null,
      taux_tva: devis.taux_tva,
      notes: devis.notes ?? '',
      statut: 'brouillon',
      lignes: devis.lignes.map((l) => ({
        description: l.description,
        quantite: l.quantite,
        prix_unitaire: l.prix_unitaire,
      })),
      converti_depuis_id: devis.id,
    })
  }

  return {
    getDocumentById,
    createDocument,
    updateDocument,
    listDocuments,
    deleteDocument,
    updateStatut,
    convertDevisToFacture,
  }
}

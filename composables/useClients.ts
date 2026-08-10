import type { Database } from '~/types/database.types'

export interface ClientInput {
  id?: string
  nom: string
  adresse?: string | null
  email?: string | null
}

export function useClients() {
  const supabase = useSupabaseClient<Database>()

  async function searchClients(query: string) {
    let request = supabase.from('clients').select('*').order('nom').limit(8)
    if (query.trim()) request = request.ilike('nom', `%${query.trim()}%`)
    const { data, error } = await request
    if (error) throw error
    return data
  }

  async function upsertClient(input: ClientInput) {
    const payload = { nom: input.nom, adresse: input.adresse || null, email: input.email || null }

    if (input.id) {
      const { data, error } = await supabase.from('clients').update(payload).eq('id', input.id).select().single()
      if (error) throw error
      return data
    }

    const { data, error } = await supabase.from('clients').insert(payload).select().single()
    if (error) throw error
    return data
  }

  /** Réutilise un client existant (nom identique) au lieu de créer un doublon. */
  async function findOrCreateClient(input: ClientInput) {
    if (input.id) return upsertClient(input)

    const { data: existing, error: findError } = await supabase
      .from('clients')
      .select('*')
      .ilike('nom', input.nom)
      .limit(1)
    if (findError) throw findError

    const match = existing?.[0]
    if (!match) return upsertClient(input)

    const changed = match.adresse !== (input.adresse || null) || match.email !== (input.email || null)
    return changed ? upsertClient({ ...input, id: match.id }) : match
  }

  return { searchClients, upsertClient, findOrCreateClient }
}

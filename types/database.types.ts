// Types alignés à la main sur supabase/migrations/*.sql.
// À régénérer avec `npx supabase gen types typescript` une fois le projet lié.

export type DocumentType = 'facture' | 'devis'

export type DocumentStatut = 'brouillon' | 'envoyee' | 'payee' | 'envoye' | 'accepte' | 'refuse'

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string
          nom: string
          adresse: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          nom: string
          adresse?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          adresse?: string | null
          email?: string | null
          created_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          user_id: string
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
        }
        Insert: {
          id?: string
          user_id?: string
          type: DocumentType
          numero: string
          client_id: string
          date_emission?: string
          date_echeance?: string | null
          taux_tva?: number
          notes?: string | null
          statut?: DocumentStatut
          total_ht?: number
          total_ttc?: number
          converti_depuis_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: DocumentType
          numero?: string
          client_id?: string
          date_emission?: string
          date_echeance?: string | null
          taux_tva?: number
          notes?: string | null
          statut?: DocumentStatut
          total_ht?: number
          total_ttc?: number
          converti_depuis_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documents_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
      }
      document_lignes: {
        Row: {
          id: string
          document_id: string
          description: string
          quantite: number
          prix_unitaire: number
          position: number
        }
        Insert: {
          id?: string
          document_id: string
          description: string
          quantite?: number
          prix_unitaire?: number
          position?: number
        }
        Update: {
          id?: string
          document_id?: string
          description?: string
          quantite?: number
          prix_unitaire?: number
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: 'document_lignes_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'documents'
            referencedColumns: ['id']
          },
        ]
      }
      compteurs: {
        Row: {
          annee: number
          type: DocumentType
          dernier_numero: number
        }
        Insert: {
          annee: number
          type: DocumentType
          dernier_numero?: number
        }
        Update: {
          annee?: number
          type?: DocumentType
          dernier_numero?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      rpc_next_numero: {
        Args: { p_type: DocumentType; p_annee: number }
        Returns: string
      }
    }
  }
}

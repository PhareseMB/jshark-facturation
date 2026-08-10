import type { Database, DocumentType } from '~/types/database.types'

export function useDocumentNumbering() {
  const supabase = useSupabaseClient<Database>()

  async function nextNumero(type: DocumentType, annee: number): Promise<string> {
    const { data, error } = await supabase.rpc('rpc_next_numero', { p_type: type, p_annee: annee })
    if (error) throw error
    return data as string
  }

  return { nextNumero }
}

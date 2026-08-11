import type { DocumentListItem } from '~/composables/useDocuments'
import type { DocumentStatut, DocumentType } from '~/types/database.types'

const typeLabels: Record<DocumentType, string> = { facture: 'Facture', devis: 'Devis' }

const statutLabels: Record<DocumentStatut, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  payee: 'Payée',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
}

export function useExcelExport() {
  async function exportDocuments(documents: DocumentListItem[], filename = 'historique-jshark') {
    // Import dynamique côté client uniquement : `xlsx` ne doit jamais entrer dans
    // le bundle serveur (Vercel échoue à tracer son module optionnel cpexcel.js,
    // ce qui fait planter tout le SSR si l'import est statique en haut de fichier).
    const XLSX = await import('xlsx')

    const rows = documents.map((d) => ({
      Numéro: d.numero,
      Type: typeLabels[d.type],
      Client: d.client.nom,
      Date: new Date(d.date_emission),
      Échéance: d.date_echeance ? new Date(d.date_echeance) : '',
      'Total HT': d.total_ht,
      'TVA %': d.taux_tva,
      'Total TTC': d.total_ttc,
      Statut: statutLabels[d.statut],
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows, { cellDates: true })

    worksheet['!cols'] = [
      { wch: 18 }, // Numéro
      { wch: 10 }, // Type
      { wch: 26 }, // Client
      { wch: 12 }, // Date
      { wch: 12 }, // Échéance
      { wch: 13 }, // Total HT
      { wch: 8 }, // TVA %
      { wch: 13 }, // Total TTC
      { wch: 12 }, // Statut
    ]

    const applyFormat = (row: number, col: number, format: string) => {
      const ref = XLSX.utils.encode_cell({ r: row, c: col })
      const cell = worksheet[ref]
      if (cell) cell.z = format
    }

    const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1')
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      applyFormat(row, 3, 'dd/mm/yyyy') // Date
      applyFormat(row, 4, 'dd/mm/yyyy') // Échéance
      applyFormat(row, 5, '#,##0 "FCFA"') // Total HT
      applyFormat(row, 6, '0.00"%"') // TVA %
      applyFormat(row, 7, '#,##0 "FCFA"') // Total TTC
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historique')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  return { exportDocuments }
}

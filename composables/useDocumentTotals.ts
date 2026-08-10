import { calcTotaux, type LigneCalculable } from '~/utils/totals'

export function useDocumentTotals(lignes: Ref<LigneCalculable[]>, tauxTva: Ref<number>) {
  const totalHT = computed(() => calcTotaux(lignes.value, tauxTva.value).totalHT)
  const montantTva = computed(() => calcTotaux(lignes.value, tauxTva.value).montantTva)
  const totalTTC = computed(() => calcTotaux(lignes.value, tauxTva.value).totalTTC)

  return { totalHT, montantTva, totalTTC }
}

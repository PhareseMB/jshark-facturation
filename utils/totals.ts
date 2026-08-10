export interface LigneCalculable {
  quantite: number
  prix_unitaire: number
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function calcTotaux(lignes: LigneCalculable[], tauxTva: number) {
  const totalHT = round2(
    lignes.reduce((sum, l) => sum + (Number(l.quantite) || 0) * (Number(l.prix_unitaire) || 0), 0),
  )
  const montantTva = round2(totalHT * ((Number(tauxTva) || 0) / 100))
  const totalTTC = round2(totalHT + montantTva)

  return { totalHT, montantTva, totalTTC }
}

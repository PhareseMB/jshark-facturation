import { z } from 'zod'

export const ligneSchema = z.object({
  description: z.string().min(1, 'Description requise'),
  quantite: z.number('Quantité invalide').positive('La quantité doit être positive'),
  prix_unitaire: z.number('Prix invalide').nonnegative('Le prix ne peut pas être négatif'),
})

export const clientSchema = z.object({
  nom: z.string().min(1, 'Nom / société requis'),
  adresse: z.string().optional().default(''),
  email: z.union([z.email('Email invalide'), z.literal('')]).optional().default(''),
})

export const documentSchema = z.object({
  type: z.enum(['facture', 'devis']),
  client: clientSchema,
  date_emission: z.string().min(1, "Date d'émission requise"),
  date_echeance: z.string().optional().nullable(),
  taux_tva: z.number().min(0, 'Taux invalide').max(100, 'Taux invalide'),
  notes: z.string().optional().default(''),
  lignes: z.array(ligneSchema).min(1, 'Ajoutez au moins une ligne de prestation'),
})

export type LigneInput = z.infer<typeof ligneSchema>
export type ClientInput = z.infer<typeof clientSchema>
export type DocumentFormInput = z.infer<typeof documentSchema>

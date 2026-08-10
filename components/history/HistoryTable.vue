<script setup lang="ts">
import type { DocumentListItem } from '~/composables/useDocuments'
import type { DocumentStatut } from '~/types/database.types'

defineProps<{ documents: DocumentListItem[]; actingId?: string | null }>()
const emit = defineEmits<{
  changeStatut: [id: string, statut: DocumentStatut]
  convert: [id: string]
  remove: [id: string]
}>()

function nextActions(doc: DocumentListItem): { label: string; statut: DocumentStatut }[] {
  if (doc.type === 'facture') {
    if (doc.statut === 'brouillon') return [{ label: 'Marquer envoyée', statut: 'envoyee' }]
    if (doc.statut === 'envoyee') return [{ label: 'Marquer payée', statut: 'payee' }]
    return []
  }
  if (doc.statut === 'brouillon') return [{ label: 'Marquer envoyé', statut: 'envoye' }]
  if (doc.statut === 'envoye') {
    return [
      { label: 'Accepter', statut: 'accepte' },
      { label: 'Refuser', statut: 'refuse' },
    ]
  }
  return []
}
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-abyss-600">
    <table class="w-full min-w-[900px] text-sm">
      <thead>
        <tr class="border-b border-abyss-600 bg-abyss-800/60 text-left text-xs uppercase tracking-wide text-slate-400">
          <th class="px-4 py-3 font-medium">Numéro</th>
          <th class="px-4 py-3 font-medium">Type</th>
          <th class="px-4 py-3 font-medium">Client</th>
          <th class="px-4 py-3 font-medium">Date</th>
          <th class="px-4 py-3 font-medium">Échéance</th>
          <th class="px-4 py-3 text-right font-medium">Total TTC</th>
          <th class="px-4 py-3 font-medium">Statut</th>
          <th class="px-4 py-3 font-medium" aria-hidden="true" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id" class="border-b border-abyss-700 last:border-0 hover:bg-abyss-800/40">
          <td class="px-4 py-3 font-mono text-glacier-300">
            <NuxtLink :to="`/documents/${doc.id}`" class="hover:underline">{{ doc.numero }}</NuxtLink>
          </td>
          <td class="px-4 py-3 text-slate-300">{{ doc.type === 'facture' ? 'Facture' : 'Devis' }}</td>
          <td class="px-4 py-3 text-slate-200">{{ doc.client.nom }}</td>
          <td class="px-4 py-3 font-mono tabular-nums text-slate-300">{{ formatDate(doc.date_emission) }}</td>
          <td class="px-4 py-3 font-mono tabular-nums text-slate-400">{{ formatDate(doc.date_echeance) }}</td>
          <td class="px-4 py-3 text-right font-mono tabular-nums text-slate-100">{{ formatMontant(doc.total_ttc) }}</td>
          <td class="px-4 py-3"><StatusBadge :statut="doc.statut" /></td>
          <td class="px-4 py-3">
            <div class="flex flex-wrap justify-end gap-1.5">
              <button
                v-for="action in nextActions(doc)"
                :key="action.statut"
                type="button"
                class="rounded-md border border-abyss-500 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-glacier-400 hover:text-glacier-300 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="actingId === doc.id"
                @click="emit('changeStatut', doc.id, action.statut)"
              >
                {{ action.label }}
              </button>
              <button
                v-if="doc.type === 'devis' && doc.statut === 'accepte'"
                type="button"
                class="rounded-md border border-glacier-400/50 bg-glacier-400/10 px-2 py-1 text-xs text-glacier-300 transition-colors hover:bg-glacier-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="actingId === doc.id"
                @click="emit('convert', doc.id)"
              >
                Convertir en facture
              </button>
              <NuxtLink
                :to="`/documents/${doc.id}/imprimer`"
                class="rounded-md border border-abyss-500 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-glacier-400 hover:text-glacier-300"
              >
                Imprimer
              </NuxtLink>
              <button
                type="button"
                class="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="actingId === doc.id"
                @click="emit('remove', doc.id)"
              >
                Supprimer
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

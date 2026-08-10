<script setup lang="ts">
import type { DocumentListItem } from '~/composables/useDocuments'
import type { DocumentStatut } from '~/types/database.types'

const props = defineProps<{ doc: DocumentListItem; actingId?: string | null }>()
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
  <div class="flex flex-wrap gap-1.5">
    <button
      v-for="action in nextActions(props.doc)"
      :key="action.statut"
      type="button"
      class="rounded-md border border-abyss-500 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-glacier-400 hover:text-glacier-300 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="actingId === props.doc.id"
      @click="emit('changeStatut', props.doc.id, action.statut)"
    >
      {{ action.label }}
    </button>
    <button
      v-if="props.doc.type === 'devis' && props.doc.statut === 'accepte'"
      type="button"
      class="rounded-md border border-glacier-400/50 bg-glacier-400/10 px-2 py-1 text-xs text-glacier-300 transition-colors hover:bg-glacier-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="actingId === props.doc.id"
      @click="emit('convert', props.doc.id)"
    >
      Convertir en facture
    </button>
    <NuxtLink
      :to="`/documents/${props.doc.id}/imprimer`"
      class="rounded-md border border-abyss-500 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-glacier-400 hover:text-glacier-300"
    >
      Imprimer
    </NuxtLink>
    <button
      type="button"
      class="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="actingId === props.doc.id"
      @click="emit('remove', props.doc.id)"
    >
      Supprimer
    </button>
  </div>
</template>

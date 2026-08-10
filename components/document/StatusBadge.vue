<script setup lang="ts">
import type { DocumentStatut } from '~/types/database.types'

const props = defineProps<{ statut: DocumentStatut }>()

const labels: Record<DocumentStatut, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  payee: 'Payée',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
}

const styles: Record<DocumentStatut, string> = {
  brouillon: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  envoyee: 'bg-glacier-400/15 text-glacier-300 border-glacier-400/30',
  envoye: 'bg-glacier-400/15 text-glacier-300 border-glacier-400/30',
  payee: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  accepte: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  refuse: 'bg-red-500/15 text-red-300 border-red-500/30',
}
</script>

<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" :class="styles[props.statut]">
    {{ labels[props.statut] }}
  </span>
</template>

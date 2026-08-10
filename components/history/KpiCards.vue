<script setup lang="ts">
defineProps<{ totalEncaisse: number; enAttente: number; nbDocumentsAnnee: number; annee: number }>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-5">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Total encaissé</p>
      <p class="mt-2 font-mono text-2xl font-semibold tabular-nums text-emerald-300">{{ formatMontant(totalEncaisse) }}</p>
      <p class="mt-1 text-xs text-slate-500">Factures payées</p>
    </div>
    <div class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-5">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">En attente</p>
      <p class="mt-2 font-mono text-2xl font-semibold tabular-nums text-glacier-300">{{ formatMontant(enAttente) }}</p>
      <p class="mt-1 text-xs text-slate-500">Factures envoyées, non réglées</p>
    </div>
    <div class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-5">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Documents {{ annee }}</p>
      <p class="mt-2 font-mono text-2xl font-semibold tabular-nums text-white">{{ nbDocumentsAnnee }}</p>
      <p class="mt-1 text-xs text-slate-500">Factures et devis émis</p>
    </div>
  </div>
</template>

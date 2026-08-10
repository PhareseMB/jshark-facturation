<script setup lang="ts">
defineProps<{ totalHT: number; montantTva: number; totalTTC: number; tauxTva: number }>()
</script>

<template>
  <dl class="ml-auto flex w-full max-w-xs flex-col gap-1.5 text-sm">
    <div class="flex justify-between">
      <dt class="text-slate-400">Total HT</dt>
      <dd class="font-mono tabular-nums text-slate-200">{{ formatMontant(totalHT) }}</dd>
    </div>
    <div class="flex justify-between">
      <dt class="text-slate-400">TVA ({{ tauxTva }}%)</dt>
      <dd class="font-mono tabular-nums text-slate-200">{{ formatMontant(montantTva) }}</dd>
    </div>
    <div class="flex justify-between border-t border-abyss-600 pt-1.5 text-base font-semibold">
      <dt class="text-white">Total TTC</dt>
      <dd class="font-mono tabular-nums text-glacier-300">{{ formatMontant(totalTTC) }}</dd>
    </div>
  </dl>
</template>

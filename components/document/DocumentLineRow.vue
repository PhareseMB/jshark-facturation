<script setup lang="ts">
import type { LigneInputDraft } from '~/composables/useDocuments'

const props = defineProps<{ modelValue: LigneInputDraft; canDelete: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: LigneInputDraft]; remove: [] }>()

const totalLigne = computed(
  () => (Number(props.modelValue.quantite) || 0) * (Number(props.modelValue.prix_unitaire) || 0),
)

function update(patch: Partial<LigneInputDraft>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}
</script>

<template>
  <tr class="border-b border-abyss-700 last:border-0">
    <td class="px-3 py-2">
      <input
        type="text"
        placeholder="Ex. Création logo + charte graphique"
        class="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-100 placeholder:text-slate-500 hover:border-abyss-500 focus:border-abyss-400 focus:bg-abyss-800"
        :value="modelValue.description"
        @input="update({ description: ($event.target as HTMLInputElement).value })"
      />
    </td>
    <td class="px-3 py-2">
      <input
        type="number"
        min="0"
        step="0.5"
        class="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right font-mono tabular-nums text-slate-100 hover:border-abyss-500 focus:border-abyss-400 focus:bg-abyss-800"
        :value="modelValue.quantite"
        @input="update({ quantite: Number(($event.target as HTMLInputElement).value) })"
      />
    </td>
    <td class="px-3 py-2">
      <input
        type="number"
        min="0"
        step="0.01"
        class="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right font-mono tabular-nums text-slate-100 hover:border-abyss-500 focus:border-abyss-400 focus:bg-abyss-800"
        :value="modelValue.prix_unitaire"
        @input="update({ prix_unitaire: Number(($event.target as HTMLInputElement).value) })"
      />
    </td>
    <td class="px-3 py-2 text-right font-mono tabular-nums text-slate-300">{{ formatMontant(totalLigne) }}</td>
    <td class="px-2 py-2 text-center">
      <button
        type="button"
        :disabled="!canDelete"
        class="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Supprimer la ligne"
        @click="emit('remove')"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </td>
  </tr>
</template>

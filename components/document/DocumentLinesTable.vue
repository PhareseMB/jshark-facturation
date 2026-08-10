<script setup lang="ts">
import type { LigneInputDraft } from '~/composables/useDocuments'

const props = defineProps<{ modelValue: LigneInputDraft[]; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: LigneInputDraft[]] }>()

function updateLigne(index: number, patch: Partial<LigneInputDraft>) {
  emit(
    'update:modelValue',
    props.modelValue.map((l, i) => (i === index ? { ...l, ...patch } : l)),
  )
}

function addLigne() {
  emit('update:modelValue', [...props.modelValue, { description: '', quantite: 1, prix_unitaire: 0 }])
}

function removeLigne(index: number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  )
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-slate-300">Lignes de prestation</h2>
      <BaseButton variant="secondary" type="button" @click="addLigne">+ Ajouter une ligne</BaseButton>
    </div>

    <p v-if="error" class="text-xs text-red-400">{{ error }}</p>

    <div class="overflow-x-auto rounded-xl border border-abyss-600">
      <table class="w-full min-w-[560px] text-sm">
        <thead>
          <tr class="border-b border-abyss-600 bg-abyss-800/60 text-left text-xs uppercase tracking-wide text-slate-400">
            <th class="px-3 py-2 font-medium">Description</th>
            <th class="w-24 px-3 py-2 text-right font-medium">Qté</th>
            <th class="w-32 px-3 py-2 text-right font-medium">PU HT</th>
            <th class="w-32 px-3 py-2 text-right font-medium">Total HT</th>
            <th class="w-10 px-2 py-2" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          <DocumentLineRow
            v-for="(ligne, index) in modelValue"
            :key="index"
            :model-value="ligne"
            :can-delete="modelValue.length > 1"
            @update:model-value="updateLigne(index, $event)"
            @remove="removeLigne(index)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

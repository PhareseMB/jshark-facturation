<script setup lang="ts">
import type { DocumentStatut, DocumentType } from '~/types/database.types'

export interface HistoryFiltersState {
  type: DocumentType | ''
  statut: DocumentStatut | ''
  clientQuery: string
  annee: number | ''
}

const props = defineProps<{ modelValue: HistoryFiltersState; years: number[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: HistoryFiltersState] }>()

function update(patch: Partial<HistoryFiltersState>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

const statutOptionsByType: Record<'' | DocumentType, { value: DocumentStatut | ''; label: string }[]> = {
  '': [
    { value: '', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'envoyee', label: 'Envoyée (facture)' },
    { value: 'payee', label: 'Payée' },
    { value: 'envoye', label: 'Envoyé (devis)' },
    { value: 'accepte', label: 'Accepté' },
    { value: 'refuse', label: 'Refusé' },
  ],
  facture: [
    { value: '', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'envoyee', label: 'Envoyée' },
    { value: 'payee', label: 'Payée' },
  ],
  devis: [
    { value: '', label: 'Tous les statuts' },
    { value: 'brouillon', label: 'Brouillon' },
    { value: 'envoye', label: 'Envoyé' },
    { value: 'accepte', label: 'Accepté' },
    { value: 'refuse', label: 'Refusé' },
  ],
}

const statutOptions = computed(() => statutOptionsByType[props.modelValue.type])
</script>

<template>
  <div class="flex flex-wrap items-end gap-3">
    <BaseSelect
      :model-value="modelValue.type"
      label="Type"
      :options="[
        { value: '', label: 'Tous' },
        { value: 'facture', label: 'Factures' },
        { value: 'devis', label: 'Devis' },
      ]"
      @update:model-value="update({ type: $event as DocumentType | '', statut: '' })"
    />
    <BaseSelect
      :model-value="modelValue.statut"
      label="Statut"
      :options="statutOptions"
      @update:model-value="update({ statut: $event as DocumentStatut | '' })"
    />
    <BaseSelect
      :model-value="modelValue.annee === '' ? '' : String(modelValue.annee)"
      label="Année"
      :options="[{ value: '', label: 'Toutes' }, ...years.map((y) => ({ value: String(y), label: String(y) }))]"
      @update:model-value="update({ annee: $event ? Number($event) : '' })"
    />
    <div class="min-w-[220px] flex-1">
      <BaseInput
        :model-value="modelValue.clientQuery"
        label="Client"
        placeholder="Rechercher un client…"
        @update:model-value="update({ clientQuery: $event })"
      />
    </div>
  </div>
</template>

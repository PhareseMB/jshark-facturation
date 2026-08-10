<script setup lang="ts">
import type { ClientInput } from '~/composables/useClients'

const props = defineProps<{ modelValue: ClientInput; errors?: Record<string, string> }>()
const emit = defineEmits<{ 'update:modelValue': [value: ClientInput] }>()

function update(patch: Partial<ClientInput>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="sm:col-span-2">
      <ClientAutocomplete :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
      <p v-if="errors?.nom" class="mt-1 text-xs text-red-400">{{ errors.nom }}</p>
    </div>
    <BaseInput
      :model-value="modelValue.adresse ?? ''"
      label="Adresse"
      placeholder="Adresse postale"
      @update:model-value="update({ adresse: $event })"
    />
    <BaseInput
      :model-value="modelValue.email ?? ''"
      type="email"
      label="Email"
      placeholder="client@exemple.fr"
      :error="errors?.email"
      @update:model-value="update({ email: $event })"
    />
  </div>
</template>

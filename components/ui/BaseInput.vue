<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    label?: string
    type?: string
    placeholder?: string
    error?: string
    required?: boolean
    mono?: boolean
    step?: string | number
    min?: string | number
    autocomplete?: string
  }>(),
  { type: 'text', required: false, mono: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = `field-${useId()}`
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-300">
      {{ label }}
      <span v-if="required" class="text-glacier-400" aria-hidden="true">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :required="required"
      :step="step"
      :min="min"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      class="rounded-lg border bg-abyss-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors"
      :class="[
        error ? 'border-red-500/60' : 'border-abyss-500 hover:border-abyss-400',
        mono ? 'font-mono tabular-nums' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" :id="`${inputId}-error`" class="text-xs text-red-400">{{ error }}</p>
  </div>
</template>

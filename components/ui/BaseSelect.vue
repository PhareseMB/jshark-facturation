<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    options: { value: string; label: string }[]
    required?: boolean
  }>(),
  { required: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const selectId = `field-${useId()}`
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="selectId" class="text-sm font-medium text-slate-300">
      {{ label }}
      <span v-if="required" class="text-glacier-400" aria-hidden="true">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :required="required"
      class="rounded-lg border border-abyss-500 bg-abyss-800 px-3 py-2.5 text-sm text-slate-100 transition-colors hover:border-abyss-400"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>

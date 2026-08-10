<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | null
    label?: string
    placeholder?: string
    rows?: number
  }>(),
  { rows: 3 },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const areaId = `field-${useId()}`
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="areaId" class="text-sm font-medium text-slate-300">{{ label }}</label>
    <textarea
      :id="areaId"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :rows="rows"
      class="resize-y rounded-lg border border-abyss-500 bg-abyss-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors hover:border-abyss-400"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

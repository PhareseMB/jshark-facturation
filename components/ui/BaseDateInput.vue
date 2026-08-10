<script setup lang="ts">
// Champ de date en texte libre affiché en jj/mm/aaaa, quel que soit le
// navigateur ou la locale système (les <input type="date"> natifs suivent la
// locale de l'OS, ce qui affichait parfois mm/jj/aaaa). Un <input type="date">
// natif reste présent (invisible) pour fournir le calendrier via showPicker().
// La valeur exposée reste au format ISO (aaaa-mm-jj) attendu par le reste de l'app.
const props = withDefaults(
  defineProps<{
    modelValue: string | null
    label?: string
    required?: boolean
  }>(),
  { required: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = `field-${useId()}`
const nativeInput = ref<HTMLInputElement | null>(null)

function isoToDisplay(iso: string | null | undefined): string {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : ''
}

const displayValue = ref(isoToDisplay(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    const next = isoToDisplay(value)
    if (next !== displayValue.value) displayValue.value = next
  },
)

function onTextInput(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)

  let formatted = digits
  if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
  displayValue.value = formatted

  const match = formatted.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  emit('update:modelValue', match ? `${match[3]}-${match[2]}-${match[1]}` : '')
}

function onPick(iso: string) {
  displayValue.value = isoToDisplay(iso)
  emit('update:modelValue', iso)
}

function openPicker() {
  nativeInput.value?.showPicker?.()
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-300">
      {{ label }}
      <span v-if="required" class="text-glacier-400" aria-hidden="true">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        placeholder="jj/mm/aaaa"
        maxlength="10"
        :value="displayValue"
        :required="required"
        class="w-full rounded-lg border border-abyss-500 bg-abyss-800 px-3 py-2.5 pr-10 font-mono text-sm tabular-nums text-slate-100 placeholder:text-slate-500 transition-colors hover:border-abyss-400"
        @input="onTextInput(($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 transition-colors hover:text-glacier-300"
        aria-label="Ouvrir le calendrier"
        @click="openPicker"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path stroke-linecap="round" d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      </button>
      <input
        ref="nativeInput"
        type="date"
        tabindex="-1"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-[-1] opacity-0"
        :value="modelValue ?? ''"
        @input="onPick(($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientInput } from '~/composables/useClients'

const props = defineProps<{ modelValue: ClientInput }>()
const emit = defineEmits<{ 'update:modelValue': [value: ClientInput] }>()

const { searchClients } = useClients()

const results = ref<Awaited<ReturnType<typeof searchClients>>>([])
const open = ref(false)
const inputId = `field-${useId()}`
let debounceHandle: ReturnType<typeof setTimeout> | undefined

function onInput(value: string) {
  emit('update:modelValue', { ...props.modelValue, id: undefined, nom: value })

  if (debounceHandle) clearTimeout(debounceHandle)
  debounceHandle = setTimeout(async () => {
    if (!value.trim()) {
      results.value = []
      open.value = false
      return
    }
    results.value = await searchClients(value)
    open.value = results.value.length > 0
  }, 200)
}

function select(client: { id: string; nom: string; adresse: string | null; email: string | null }) {
  emit('update:modelValue', {
    id: client.id,
    nom: client.nom,
    adresse: client.adresse ?? '',
    email: client.email ?? '',
  })
  open.value = false
}
</script>

<template>
  <div class="relative flex flex-col gap-1.5">
    <label :for="inputId" class="text-sm font-medium text-slate-300">
      Client / société <span class="text-glacier-400" aria-hidden="true">*</span>
    </label>
    <input
      :id="inputId"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="open"
      required
      placeholder="Nom du client ou de la société"
      class="rounded-lg border border-abyss-500 bg-abyss-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors hover:border-abyss-400"
      :value="modelValue.nom"
      autocomplete="off"
      @input="onInput(($event.target as HTMLInputElement).value)"
      @focus="open = results.length > 0"
    />

    <ul
      v-if="open"
      class="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-abyss-500 bg-abyss-800 shadow-xl"
    >
      <li v-for="client in results" :key="client.id">
        <button
          type="button"
          class="block w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-abyss-700 hover:text-glacier-300"
          @mousedown.prevent="select(client)"
        >
          {{ client.nom }}
          <span v-if="client.email" class="ml-1 text-xs text-slate-500">{{ client.email }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

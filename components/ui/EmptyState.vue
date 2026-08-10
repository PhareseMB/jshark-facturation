<script setup lang="ts">
withDefaults(defineProps<{ title: string; description?: string }>(), {})
</script>

<template>
  <div class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-abyss-500 px-6 py-12 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-abyss-700 text-glacier-400" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <p class="font-medium text-slate-200">{{ title }}</p>
    <p v-if="description" class="max-w-sm text-sm text-slate-400">{{ description }}</p>
    <slot />
  </div>
</template>

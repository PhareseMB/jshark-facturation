<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-glacier-400 text-abyss-950 hover:bg-glacier-300 shadow-glow': variant === 'primary',
      'bg-abyss-700 text-slate-100 hover:bg-abyss-600 border border-abyss-500': variant === 'secondary',
      'bg-transparent text-slate-300 hover:bg-abyss-700 hover:text-white': variant === 'ghost',
      'bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30': variant === 'danger',
    }"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin text-current"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <slot />
  </button>
</template>

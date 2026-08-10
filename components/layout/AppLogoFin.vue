<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<template>
  <span
    class="inline-block shrink-0 bg-gradient-to-br from-glacier-300 to-glacier-500"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      clipPath: 'polygon(0% 100%, 38% 0%, 58% 38%, 100% 100%)',
    }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/', label: 'Tableau de bord', path: '/', type: undefined },
  { to: '/documents/nouveau?type=facture', label: 'Nouvelle facture', path: '/documents/nouveau', type: 'facture' },
  { to: '/documents/nouveau?type=devis', label: 'Nouveau devis', path: '/documents/nouveau', type: 'devis' },
]
</script>

<template>
  <nav class="flex flex-wrap items-center gap-1" aria-label="Navigation principale">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-abyss-700 hover:text-white"
      :class="{ 'bg-abyss-700 text-glacier-300': route.path === link.path && route.query.type === link.type }"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

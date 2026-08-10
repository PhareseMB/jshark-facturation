<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const documentId = route.params.id as string
</script>

<template>
  <DocumentEditor :document-id="documentId" />
</template>

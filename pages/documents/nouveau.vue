<script setup lang="ts">
import type { DocumentType } from '~/types/database.types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const initialType = computed<DocumentType>(() => (route.query.type === 'devis' ? 'devis' : 'facture'))
</script>

<template>
  <DocumentEditor :initial-type="initialType" />
</template>

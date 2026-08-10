<script setup lang="ts">
definePageMeta({ layout: 'print' })

const route = useRoute()
const { getDocumentById } = useDocuments()

const notFound = ref(false)
const doc = ref<Awaited<ReturnType<typeof getDocumentById>> | null>(null)

try {
  doc.value = await getDocumentById(route.params.id as string)
} catch {
  notFound.value = true
}

useHead({ title: doc.value ? `Impression — ${doc.value.numero}` : 'Impression' })

function printDocument() {
  window.print()
}
</script>

<template>
  <div>
    <EmptyState
      v-if="notFound"
      class="mx-auto mt-12 max-w-md"
      title="Document introuvable"
      description="Ce document n'existe pas ou plus."
    >
      <NuxtLink to="/">
        <BaseButton variant="secondary" type="button">Retour au tableau de bord</BaseButton>
      </NuxtLink>
    </EmptyState>

    <template v-else-if="doc">
      <div class="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-2">
        <NuxtLink :to="`/documents/${doc.id}`">
          <BaseButton variant="ghost" type="button">← Retour au document</BaseButton>
        </NuxtLink>
        <BaseButton type="button" @click="printDocument">Imprimer / PDF</BaseButton>
      </div>

      <DocumentPreview :document="doc" />
    </template>
  </div>
</template>

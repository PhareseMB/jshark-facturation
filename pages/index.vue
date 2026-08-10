<script setup lang="ts">
import type { HistoryFiltersState } from '~/components/history/HistoryFilters.vue'
import type { DocumentStatut } from '~/types/database.types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Tableau de bord' })

const { listDocuments, deleteDocument, updateStatut, convertDevisToFacture } = useDocuments()
const { exportDocuments } = useExcelExport()

const documents = ref<Awaited<ReturnType<typeof listDocuments>>>([])
const loading = ref(true)
const loadError = ref(false)
const actingId = ref<string | null>(null)

async function refresh() {
  loading.value = true
  loadError.value = false
  try {
    documents.value = await listDocuments()
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

await refresh()

const currentYear = new Date().getFullYear()

const filters = reactive<HistoryFiltersState>({ type: '', statut: '', clientQuery: '', annee: '' })
const sortAsc = ref(false)

const availableYears = computed(() => {
  const years = new Set(documents.value.map((d) => new Date(d.date_emission).getFullYear()))
  years.add(currentYear)
  return Array.from(years).sort((a, b) => b - a)
})

const filteredDocuments = computed(() => {
  const needle = filters.clientQuery.trim().toLowerCase()

  const result = documents.value.filter((d) => {
    if (filters.type && d.type !== filters.type) return false
    if (filters.statut && d.statut !== filters.statut) return false
    if (filters.annee && new Date(d.date_emission).getFullYear() !== filters.annee) return false
    if (needle && !d.client.nom.toLowerCase().includes(needle)) return false
    return true
  })

  return sortAsc.value ? [...result].reverse() : result
})

const kpis = computed(() => {
  const totalEncaisse = documents.value
    .filter((d) => d.type === 'facture' && d.statut === 'payee')
    .reduce((sum, d) => sum + d.total_ttc, 0)

  const enAttente = documents.value
    .filter((d) => d.type === 'facture' && d.statut === 'envoyee')
    .reduce((sum, d) => sum + d.total_ttc, 0)

  const nbDocumentsAnnee = documents.value.filter(
    (d) => new Date(d.date_emission).getFullYear() === currentYear,
  ).length

  return { totalEncaisse, enAttente, nbDocumentsAnnee }
})

async function onChangeStatut(id: string, statut: DocumentStatut) {
  actingId.value = id
  try {
    await updateStatut(id, statut)
    await refresh()
  } finally {
    actingId.value = null
  }
}

async function onConvert(id: string) {
  actingId.value = id
  try {
    const facture = await convertDevisToFacture(id)
    await navigateTo(`/documents/${facture.id}`)
  } finally {
    actingId.value = null
  }
}

async function onRemove(id: string) {
  const doc = documents.value.find((d) => d.id === id)
  if (!doc) return
  if (!confirm(`Supprimer définitivement ${doc.numero} ? Cette action est irréversible.`)) return

  actingId.value = id
  try {
    await deleteDocument(id)
    await refresh()
  } finally {
    actingId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-brand text-2xl font-bold text-white">Tableau de bord</h1>
      <div class="flex gap-3">
        <NuxtLink to="/documents/nouveau?type=devis">
          <BaseButton variant="secondary" type="button">+ Devis</BaseButton>
        </NuxtLink>
        <NuxtLink to="/documents/nouveau?type=facture">
          <BaseButton type="button">+ Facture</BaseButton>
        </NuxtLink>
      </div>
    </div>

    <KpiCards
      :total-encaisse="kpis.totalEncaisse"
      :en-attente="kpis.enAttente"
      :nb-documents-annee="kpis.nbDocumentsAnnee"
      :annee="currentYear"
    />

    <section class="flex flex-col gap-4">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <HistoryFilters v-model="filters" :years="availableYears" />
        <div class="flex gap-3">
          <BaseButton variant="ghost" type="button" @click="sortAsc = !sortAsc">
            Tri : {{ sortAsc ? 'plus ancien d’abord' : 'plus récent d’abord' }}
          </BaseButton>
          <BaseButton
            variant="secondary"
            type="button"
            :disabled="filteredDocuments.length === 0"
            @click="exportDocuments(filteredDocuments)"
          >
            Export Excel
          </BaseButton>
        </div>
      </div>

      <p v-if="loading" class="py-8 text-center text-slate-400">Chargement…</p>

      <EmptyState v-else-if="loadError" title="Impossible de charger les documents" description="Vérifiez votre connexion et réessayez.">
        <BaseButton variant="secondary" class="mt-2" type="button" @click="refresh">Réessayer</BaseButton>
      </EmptyState>

      <EmptyState
        v-else-if="documents.length === 0"
        title="Aucun document pour l'instant"
        description="Créez votre première facture ou votre premier devis pour commencer."
      />

      <EmptyState
        v-else-if="filteredDocuments.length === 0"
        title="Aucun résultat"
        description="Aucun document ne correspond à ces filtres."
      />

      <HistoryTable
        v-else
        :documents="filteredDocuments"
        :acting-id="actingId"
        @change-statut="onChangeStatut"
        @convert="onConvert"
        @remove="onRemove"
      />
    </section>
  </div>
</template>

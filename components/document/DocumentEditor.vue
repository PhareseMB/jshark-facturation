<script setup lang="ts">
import { documentSchema } from '~/schemas/document.schema'
import type { DocumentType } from '~/types/database.types'
import type { DocumentDraftInput } from '~/composables/useDocuments'

const props = defineProps<{ documentId?: string; initialType?: DocumentType }>()

const router = useRouter()
const { getDocumentById, createDocument, updateDocument } = useDocuments()

const typeOptions: { value: DocumentType; label: string }[] = [
  { value: 'facture', label: 'Facture' },
  { value: 'devis', label: 'Devis' },
]

const draft = reactive<DocumentDraftInput>({
  type: props.initialType ?? 'facture',
  client: { nom: '', adresse: '', email: '' },
  date_emission: todayISO(),
  date_echeance: null,
  taux_tva: 20,
  notes: '',
  statut: 'brouillon',
  lignes: [{ description: '', quantite: 1, prix_unitaire: 0 }],
})

const existingNumero = ref<string | null>(null)
const loading = ref(!!props.documentId)
const notFound = ref(false)
const saving = ref(false)
const errors = ref<Record<string, string>>({})

if (props.documentId) {
  try {
    const doc = await getDocumentById(props.documentId)
    draft.type = doc.type
    draft.client = { id: doc.client.id, nom: doc.client.nom, adresse: doc.client.adresse ?? '', email: doc.client.email ?? '' }
    draft.date_emission = doc.date_emission
    draft.date_echeance = doc.date_echeance
    draft.taux_tva = doc.taux_tva
    draft.notes = doc.notes ?? ''
    draft.statut = doc.statut
    draft.lignes = doc.lignes.map((l) => ({ description: l.description, quantite: l.quantite, prix_unitaire: l.prix_unitaire }))
    existingNumero.value = doc.numero
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const lignesRef = toRef(draft, 'lignes')
const tauxTvaRef = toRef(draft, 'taux_tva')
const { totalHT, montantTva, totalTTC } = useDocumentTotals(lignesRef, tauxTvaRef)

const lignesError = computed(() => {
  if (errors.value.lignes) return errors.value.lignes
  const hasFieldError = Object.keys(errors.value).some((k) => k.startsWith('lignes.'))
  return hasFieldError ? 'Vérifiez les lignes de prestation (description, quantité, prix).' : undefined
})

const pageTitle = computed(() => {
  if (props.documentId) return draft.type === 'facture' ? 'Modifier la facture' : 'Modifier le devis'
  return draft.type === 'facture' ? 'Nouvelle facture' : 'Nouveau devis'
})

useHead({ title: pageTitle })

const previewDocument = computed(() => ({
  type: draft.type,
  numero: existingNumero.value,
  client: draft.client,
  date_emission: draft.date_emission,
  date_echeance: draft.date_echeance,
  taux_tva: draft.taux_tva,
  notes: draft.notes,
  lignes: draft.lignes,
}))

async function onSave() {
  errors.value = {}
  const result = documentSchema.safeParse(draft)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.value[issue.path.join('.')] = issue.message
    }
    return
  }

  saving.value = true
  try {
    if (props.documentId) {
      await updateDocument(props.documentId, draft)
    } else {
      await createDocument(draft)
    }
    await router.push('/')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="flex justify-center py-24 text-slate-400">Chargement…</div>

  <EmptyState
    v-else-if="notFound"
    title="Document introuvable"
    description="Ce document n'existe pas ou plus. Il a peut-être été supprimé."
  >
    <NuxtLink to="/">
      <BaseButton variant="secondary" class="mt-2" type="button">Retour au tableau de bord</BaseButton>
    </NuxtLink>
  </EmptyState>

  <form v-else class="flex flex-col gap-8" novalidate @submit.prevent="onSave">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h1 class="font-brand text-2xl font-bold text-white">{{ pageTitle }}</h1>
        <StatusBadge v-if="documentId" :statut="draft.statut" />
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink v-if="documentId" :to="`/documents/${documentId}/imprimer`">
          <BaseButton variant="secondary" type="button">Imprimer / PDF</BaseButton>
        </NuxtLink>
        <NuxtLink to="/">
          <BaseButton variant="ghost" type="button">Annuler</BaseButton>
        </NuxtLink>
        <BaseButton type="submit" :loading="saving">Enregistrer</BaseButton>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-5">
      <div class="flex flex-col gap-6 lg:col-span-3">
        <div v-if="!documentId" class="inline-flex w-fit rounded-lg border border-abyss-500 bg-abyss-800 p-1">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
            :class="draft.type === option.value ? 'bg-glacier-400 text-abyss-950' : 'text-slate-300 hover:text-white'"
            @click="draft.type = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <section class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-5">
          <DocumentClientFields
            :model-value="draft.client"
            :errors="{ nom: errors['client.nom'], email: errors['client.email'] }"
            @update:model-value="draft.client = $event"
          />
        </section>

        <section class="grid gap-4 rounded-xl border border-abyss-600 bg-abyss-800/40 p-5 sm:grid-cols-3">
          <BaseDateInput v-model="draft.date_emission" label="Date d'émission" required />
          <BaseDateInput
            v-model="draft.date_echeance"
            :label="draft.type === 'facture' ? 'Échéance' : 'Date de validité'"
          />
          <BaseInput
            :model-value="draft.taux_tva"
            type="number"
            step="0.01"
            min="0"
            label="Taux de TVA (%)"
            mono
            @update:model-value="draft.taux_tva = Number($event)"
          />
        </section>

        <section class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-5">
          <DocumentLinesTable v-model="draft.lignes" :error="lignesError" />
          <div class="mt-4 flex justify-end border-t border-abyss-600 pt-4">
            <DocumentTotals :total-h-t="totalHT" :montant-tva="montantTva" :total-t-t-c="totalTTC" :taux-tva="draft.taux_tva" />
          </div>
        </section>

        <section class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-5">
          <BaseTextarea v-model="draft.notes" label="Notes" placeholder="Conditions, précisions, remerciements…" :rows="4" />
        </section>
      </div>

      <div class="lg:sticky lg:top-6 lg:col-span-2 lg:self-start">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Aperçu en temps réel</p>
        <DocumentPreview :document="previewDocument" />
      </div>
    </div>
  </form>
</template>

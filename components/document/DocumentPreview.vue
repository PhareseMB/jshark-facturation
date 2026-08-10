<script setup lang="ts">
import { calcTotaux } from '~/utils/totals'

interface PreviewLigne {
  description: string
  quantite: number
  prix_unitaire: number
}

interface PreviewClient {
  nom: string
  adresse?: string | null
  email?: string | null
}

interface PreviewDocument {
  type: 'facture' | 'devis'
  numero?: string | null
  client: PreviewClient
  date_emission: string
  date_echeance?: string | null
  taux_tva: number
  notes?: string | null
  lignes: PreviewLigne[]
}

const props = defineProps<{ document: PreviewDocument }>()

const typeLabel = computed(() => (props.document.type === 'facture' ? 'Facture' : 'Devis'))
const echeanceLabel = computed(() => (props.document.type === 'facture' ? 'Échéance' : 'Date de validité'))
const totaux = computed(() => calcTotaux(props.document.lignes, props.document.taux_tva))
</script>

<template>
  <div
    id="document-imprimable"
    class="mx-auto w-full max-w-[210mm] overflow-hidden rounded-xl bg-white text-abyss-950 shadow-2xl print:rounded-none print:shadow-none"
  >
    <header
      class="relative overflow-hidden bg-abyss-900 px-8 py-8 text-white"
      style="print-color-adjust: exact; -webkit-print-color-adjust: exact"
    >
      <div
        class="absolute inset-y-0 right-0 w-2/5 bg-glacier-500/20"
        style="clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)"
        aria-hidden="true"
      />
      <div class="relative flex flex-wrap items-start justify-between gap-6">
        <div class="flex items-center gap-3">
          <AppLogoFin :size="36" />
          <div>
            <p class="font-brand text-xl font-extrabold uppercase tracking-wide">J-SHARK</p>
            <p class="text-xs text-glacier-200">Design graphique &amp; web</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-brand text-2xl font-extrabold uppercase tracking-wide">{{ typeLabel }}</p>
          <p class="font-mono text-sm text-glacier-200">{{ document.numero || 'Numéro attribué à l’enregistrement' }}</p>
        </div>
      </div>
    </header>

    <div class="grid gap-8 px-8 py-8 sm:grid-cols-2">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Facturé à</p>
        <p class="mt-1 font-semibold text-abyss-900">{{ document.client.nom || 'Client' }}</p>
        <p v-if="document.client.adresse" class="whitespace-pre-line text-sm text-slate-600">{{ document.client.adresse }}</p>
        <p v-if="document.client.email" class="text-sm text-slate-600">{{ document.client.email }}</p>
      </div>
      <div class="sm:text-right">
        <div class="flex justify-between sm:justify-end sm:gap-8">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Date d'émission</p>
          <p class="font-mono text-sm text-abyss-900">{{ formatDate(document.date_emission) }}</p>
        </div>
        <div class="mt-1 flex justify-between sm:justify-end sm:gap-8">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ echeanceLabel }}</p>
          <p class="font-mono text-sm text-abyss-900">{{ formatDate(document.date_echeance) }}</p>
        </div>
      </div>
    </div>

    <div class="px-8">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-abyss-900/80 text-left text-xs uppercase tracking-wide text-slate-500">
            <th class="py-2 font-semibold">Description</th>
            <th class="py-2 text-right font-semibold">Qté</th>
            <th class="py-2 text-right font-semibold">PU HT</th>
            <th class="py-2 text-right font-semibold">Total HT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ligne, index) in document.lignes" :key="index" class="border-b border-slate-200">
            <td class="py-2 pr-4">{{ ligne.description || '—' }}</td>
            <td class="py-2 text-right font-mono tabular-nums">{{ ligne.quantite }}</td>
            <td class="py-2 text-right font-mono tabular-nums">{{ formatMontant(ligne.prix_unitaire) }}</td>
            <td class="py-2 text-right font-mono tabular-nums">{{ formatMontant(ligne.quantite * ligne.prix_unitaire) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end py-6">
        <dl class="w-64 space-y-1.5 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-500">Total HT</dt>
            <dd class="font-mono tabular-nums">{{ formatMontant(totaux.totalHT) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">TVA ({{ document.taux_tva }}%)</dt>
            <dd class="font-mono tabular-nums">{{ formatMontant(totaux.montantTva) }}</dd>
          </div>
          <div class="flex justify-between border-t border-abyss-900/40 pt-1.5 text-base font-bold">
            <dt>Total TTC</dt>
            <dd class="font-mono tabular-nums">{{ formatMontant(totaux.totalTTC) }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-if="document.notes" class="border-t border-slate-200 px-8 py-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
      <p class="mt-1 whitespace-pre-line text-sm text-slate-600">{{ document.notes }}</p>
    </div>

    <footer class="border-t border-slate-200 bg-slate-50 px-8 py-4 text-center text-[11px] leading-relaxed text-slate-400">
      <p>
        J-SHARK — SIRET : <em>[À compléter]</em>
        <span v-if="document.type === 'facture'">
          — <em>[Mention TVA à compléter — ex. « TVA non applicable, art. 293 B du CGI »]</em>
        </span>
        <span v-else> — Devis valable jusqu'à la date de validité indiquée ci-dessus.</span>
      </p>
    </footer>
  </div>
</template>

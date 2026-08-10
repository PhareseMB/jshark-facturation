<script setup lang="ts">
import type { DocumentListItem } from '~/composables/useDocuments'
import type { DocumentStatut } from '~/types/database.types'

defineProps<{ documents: DocumentListItem[]; actingId?: string | null }>()
const emit = defineEmits<{
  changeStatut: [id: string, statut: DocumentStatut]
  convert: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <div>
    <!-- Cartes empilées sur mobile : plus lisible qu'un tableau compressé. -->
    <div class="flex flex-col gap-3 sm:hidden">
      <div v-for="doc in documents" :key="doc.id" class="rounded-xl border border-abyss-600 bg-abyss-800/40 p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <NuxtLink :to="`/documents/${doc.id}`" class="font-mono text-sm text-glacier-300 hover:underline">
              {{ doc.numero }}
            </NuxtLink>
            <p class="truncate text-sm text-slate-300">
              {{ doc.type === 'facture' ? 'Facture' : 'Devis' }} — {{ doc.client.nom }}
            </p>
          </div>
          <StatusBadge :statut="doc.statut" />
        </div>

        <div class="mt-3 flex items-end justify-between gap-3">
          <div class="font-mono text-xs tabular-nums text-slate-400">
            <p>{{ formatDate(doc.date_emission) }}</p>
            <p v-if="doc.date_echeance">→ {{ formatDate(doc.date_echeance) }}</p>
          </div>
          <p class="font-mono text-base font-semibold tabular-nums text-slate-100">{{ formatMontant(doc.total_ttc) }}</p>
        </div>

        <HistoryRowActions
          :doc="doc"
          :acting-id="actingId"
          class="mt-3 border-t border-abyss-700 pt-3"
          @change-statut="(id, statut) => emit('changeStatut', id, statut)"
          @convert="emit('convert', $event)"
          @remove="emit('remove', $event)"
        />
      </div>
    </div>

    <!-- Tableau classique à partir de sm. -->
    <div class="hidden overflow-x-auto rounded-xl border border-abyss-600 sm:block">
      <table class="w-full min-w-[900px] text-sm">
        <thead>
          <tr class="border-b border-abyss-600 bg-abyss-800/60 text-left text-xs uppercase tracking-wide text-slate-400">
            <th class="px-4 py-3 font-medium">Numéro</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Client</th>
            <th class="px-4 py-3 font-medium">Date</th>
            <th class="px-4 py-3 font-medium">Échéance</th>
            <th class="px-4 py-3 text-right font-medium">Total TTC</th>
            <th class="px-4 py-3 font-medium">Statut</th>
            <th class="px-4 py-3 font-medium" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.id" class="border-b border-abyss-700 last:border-0 hover:bg-abyss-800/40">
            <td class="px-4 py-3 font-mono text-glacier-300">
              <NuxtLink :to="`/documents/${doc.id}`" class="hover:underline">{{ doc.numero }}</NuxtLink>
            </td>
            <td class="px-4 py-3 text-slate-300">{{ doc.type === 'facture' ? 'Facture' : 'Devis' }}</td>
            <td class="px-4 py-3 text-slate-200">{{ doc.client.nom }}</td>
            <td class="px-4 py-3 font-mono tabular-nums text-slate-300">{{ formatDate(doc.date_emission) }}</td>
            <td class="px-4 py-3 font-mono tabular-nums text-slate-400">{{ formatDate(doc.date_echeance) }}</td>
            <td class="px-4 py-3 text-right font-mono tabular-nums text-slate-100">{{ formatMontant(doc.total_ttc) }}</td>
            <td class="px-4 py-3"><StatusBadge :statut="doc.statut" /></td>
            <td class="px-4 py-3">
              <HistoryRowActions
                :doc="doc"
                :acting-id="actingId"
                class="justify-end"
                @change-statut="(id, statut) => emit('changeStatut', id, statut)"
                @convert="emit('convert', $event)"
                @remove="emit('remove', $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

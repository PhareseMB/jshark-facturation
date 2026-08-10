# Prompt à coller dans Claude Code

Utilise ta compétence (skill) **ui-ux-pro-max** pour tout ce qui concerne le design, avant d'écrire le moindre composant.

## Contexte

Je suis freelance en design graphique et web sous la marque **J-SHARK**. Construis-moi une application web de facturation légère, pour un usage solo, déployable sur **Vercel**.

## Stack imposée

- **Nuxt 3** (Vue 3, Composition API, `<script setup>`, TypeScript)
- **Tailwind CSS** pour le style
- **Supabase** : base de données PostgreSQL + authentification (login simple par email/mot de passe, un seul utilisateur : moi)
- **SheetJS (xlsx)** pour l'export Excel côté client
- Génération PDF **sans librairie** : template HTML du document + styles `@media print` + `window.print()`
- Validation des formulaires avec **Zod**
- Déploiement cible : **Vercel** (fournis la config nécessaire et les variables d'environnement à définir)

## Fonctionnalités

1. **Éditeur de document** avec bascule **Facture / Devis** :
   - Infos client (nom/société, adresse, email)
   - Lignes de prestation dynamiques (description, quantité, prix unitaire HT), ajout/suppression
   - Taux de TVA modifiable, date d'émission, échéance (facture) ou date de validité (devis), zone de notes
   - Calculs automatiques : total HT, montant TVA, total TTC
   - **Aperçu du document en temps réel** à côté du formulaire, fidèle à ce qui sera imprimé
2. **Numérotation automatique et séquentielle**, persistée en base :
   - Factures : `JSHARK-F-{année}-{numéro sur 3 chiffres}` (ex. JSHARK-F-2026-001)
   - Devis : `JSHARK-D-{année}-{numéro sur 3 chiffres}`
   - Le compteur repart à 001 chaque année ; jamais de doublon, même après suppression
3. **Statuts** avec cycle : brouillon → envoyée → payée (facture) ; brouillon → envoyé → accepté / refusé (devis). Un devis accepté peut être **converti en facture** en un clic (nouvelle facture pré-remplie avec un nouveau numéro).
4. **Historique** : tableau filtrable (type, statut, client, année), tri par date, réédition d'un document existant, et 3 indicateurs en tête : total encaissé (factures payées), en attente (factures envoyées), nombre de documents de l'année.
5. **Export Excel** de l'historique filtré : colonnes Numéro, Type, Client, Date, Échéance, Total HT, TVA %, Total TTC, Statut. Largeurs de colonnes soignées, nombres au format numérique (pas du texte).
6. **Impression / PDF** : bouton « Imprimer / PDF » qui n'imprime que le document (jamais l'interface), rendu propre sur une page A4, couleurs d'en-tête conservées à l'impression (`print-color-adjust: exact`).
7. **Gestion des clients** : les clients saisis sont enregistrés et réutilisables (autocomplétion dans l'éditeur).

## Schéma de base (Supabase)

Crée les migrations SQL avec RLS activé (accès restreint à l'utilisateur authentifié) :

- `clients` : id, nom, adresse, email, created_at
- `documents` : id, type ('facture' | 'devis'), numero (unique), client_id, date_emission, date_echeance, taux_tva, notes, statut, total_ht, total_ttc, created_at
- `document_lignes` : id, document_id, description, quantite, prix_unitaire, position
- `compteurs` : annee, type, dernier_numero — utilisés dans une fonction Postgres (RPC) pour attribuer le prochain numéro de façon atomique

## Design

- Applique ta compétence **ui-ux-pro-max** pour la direction artistique, la hiérarchie, les états (hover, focus, vide, erreur) et l'accessibilité.
- Identité J-SHARK : univers requin/océan traité avec sobriété — interface sombre (bleu abysse), accent cyan glacier, logo « aileron » géométrique (simple forme CSS `clip-path`, pas d'image), typographie affirmée pour la marque (type Archivo étendu), chiffres en police mono à chasse fixe (montants, numéros).
- Le **document imprimé** (facture/devis) doit rester très pro et lisible : papier blanc, en-tête bleu abysse coupé en diagonale (rappel de l'aileron), tableau de prestations net, totaux alignés à droite.
- Interface en **français**, responsive jusqu'au mobile, focus clavier visibles.
- Mentions légales en pied de document (SIRET, mention TVA) : mets des placeholders clairement identifiés que je remplacerai.

## Méthode de travail attendue

1. Commence par me présenter un plan (arborescence, schéma SQL, liste des pages/composants) et attends ma validation.
2. Ensuite implémente par étapes : setup projet → Supabase (migrations + RPC numérotation) → auth → éditeur + aperçu → historique + statuts → export Excel → impression → polish design.
3. Termine par un `README.md` en français : installation, variables d'environnement Supabase, commandes, et procédure de déploiement sur Vercel pas à pas.
4. À chaque étape, vérifie que le build passe (`npm run build`) avant de passer à la suivante.

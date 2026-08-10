# J-SHARK — Facturation

Application de facturation solo pour J-SHARK (design graphique & web) : factures et devis avec numérotation automatique, historique, export Excel et impression/PDF. Construite en Nuxt 3 + Supabase, pensée pour un usage mono-utilisateur.

## Stack

- **Nuxt 3** (Vue 3, Composition API, TypeScript)
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth email/mot de passe)
- **SheetJS (xlsx)** pour l'export Excel
- Impression/PDF via `window.print()` (aucune librairie PDF)
- **Zod** pour la validation des formulaires
- Déploiement : **Vercel**

## Prérequis

- Node.js 20+ (testé avec Node 24)
- Un compte [Supabase](https://supabase.com) (le plan gratuit suffit largement pour un usage solo)
- Un compte [Vercel](https://vercel.com) pour le déploiement

## 1. Installation locale

```bash
npm install
cp .env.example .env
```

Complétez `.env` avec les valeurs de votre projet Supabase (voir étape 2).

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000.

## 2. Configuration Supabase

### 2.1 Créer le projet

Créez un nouveau projet sur [supabase.com](https://supabase.com/dashboard). Notez son **URL** et sa **clé `anon` publique** (Project Settings → API) — elles alimentent les variables d'environnement.

### 2.2 Exécuter les migrations

Dans le **SQL Editor** de Supabase, exécutez dans l'ordre le contenu des fichiers :

1. `supabase/migrations/0001_init.sql` — tables `clients`, `documents`, `document_lignes`, `compteurs` et politiques RLS
2. `supabase/migrations/0002_rpc_numerotation.sql` — fonction `rpc_next_numero` pour la numérotation atomique

(Si vous utilisez la CLI Supabase, `supabase db push` fonctionne aussi une fois le projet lié avec `supabase link`.)

### 2.3 Créer votre compte utilisateur

L'application n'a pas d'écran d'inscription (usage solo). Créez votre unique compte depuis **Authentication → Users → Add user** dans le dashboard Supabase, avec votre email et un mot de passe. C'est ce compte qui se connecte sur `/login`.

### 2.4 Régénérer les types (optionnel)

Le fichier `types/database.types.ts` est écrit à la main pour correspondre au schéma SQL. Si vous faites évoluer le schéma, vous pouvez le régénérer avec la CLI Supabase :

```bash
npx supabase gen types typescript --project-id <votre-project-id> > types/database.types.ts
```

## 3. Variables d'environnement

| Variable | Description |
| --- | --- |
| `NUXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (Project Settings → API) |
| `NUXT_PUBLIC_SUPABASE_KEY` | Clé publique `anon` du projet Supabase |

Voir `.env.example`.

## 4. Commandes

```bash
npm run dev        # serveur de développement
npm run build      # build de production
npm run preview    # prévisualiser le build de production en local
npm run typecheck  # vérification TypeScript (vue-tsc)
```

## 5. Déploiement sur Vercel

Nuxt 3 est reconnu nativement par Vercel : aucun `vercel.json` n'est nécessaire.

1. Poussez le projet sur un dépôt Git (GitHub/GitLab/Bitbucket).
2. Sur [vercel.com/new](https://vercel.com/new), importez le dépôt. Vercel détecte automatiquement Nuxt et configure la commande de build.
3. Dans **Settings → Environment Variables**, ajoutez :
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_KEY`
4. Déployez. Les déploiements suivants se déclenchent automatiquement à chaque push sur la branche liée.

## Mentions légales du document imprimé

Le pied de page des factures/devis (`components/document/DocumentPreview.vue`) contient des placeholders à compléter avec vos informations réelles avant tout envoi à un client :

- **SIRET**
- **Mention TVA** (ex. franchise en base ou numéro de TVA intracommunautaire)

Recherchez `[À compléter]` dans ce fichier pour les localiser.

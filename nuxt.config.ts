export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],

  css: ['~/assets/css/main.css', '~/assets/css/print.css'],

  // Noms de composants courts (BaseButton, AppHeader, ClientAutocomplete…) même
  // quand les fichiers sont organisés dans des sous-dossiers (ui/, layout/, document/…).
  components: [{ path: '~/components', pathPrefix: false }],

  supabase: {
    // Redirects are handled by middleware/auth.global.ts instead.
    redirect: false,
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'J-SHARK — Facturation',
      titleTemplate: '%s — J-SHARK',
      htmlAttrs: { lang: 'fr' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})

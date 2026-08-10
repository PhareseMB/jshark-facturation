<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Connexion' })

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (authError) {
    error.value = 'Email ou mot de passe incorrect.'
    return
  }

  await navigateTo('/')
}
</script>

<template>
  <div class="w-full max-w-sm">
    <div class="mb-8 flex flex-col items-center gap-3">
      <AppLogoFin :size="48" />
      <h1 class="font-brand text-2xl font-extrabold uppercase tracking-wide text-white">J-SHARK</h1>
      <p class="text-sm text-slate-400">Facturation — accès privé</p>
    </div>

    <form
      class="flex flex-col gap-4 rounded-2xl border border-abyss-600 bg-abyss-800/60 p-6 shadow-xl"
      novalidate
      @submit.prevent="onSubmit"
    >
      <BaseInput v-model="email" type="email" label="Email" placeholder="vous@jshark.fr" required autocomplete="username" />
      <BaseInput v-model="password" type="password" label="Mot de passe" required autocomplete="current-password" />

      <p v-if="error" role="alert" class="text-sm text-red-400">{{ error }}</p>

      <BaseButton type="submit" :loading="loading" class="mt-2 w-full justify-center">
        Se connecter
      </BaseButton>
    </form>
  </div>
</template>

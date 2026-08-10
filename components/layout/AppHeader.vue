<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loggingOut = ref(false)

async function logout() {
  loggingOut.value = true
  await supabase.auth.signOut()
  loggingOut.value = false
  await navigateTo('/login')
}
</script>

<template>
  <header class="border-b border-abyss-700 bg-abyss-900/80 backdrop-blur">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <div class="flex items-center gap-3">
        <AppLogoFin :size="28" />
        <NuxtLink to="/" class="font-brand text-lg font-extrabold uppercase tracking-wide text-white">
          J-SHARK
        </NuxtLink>
      </div>

      <AppNav class="order-3 w-full sm:order-none sm:w-auto" />

      <div class="flex items-center gap-3">
        <span v-if="user" class="hidden text-sm text-slate-400 sm:inline">{{ user.email }}</span>
        <BaseButton variant="ghost" :loading="loggingOut" @click="logout">Déconnexion</BaseButton>
      </div>
    </div>
  </header>
</template>

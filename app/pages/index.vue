<template>
  <UPageHero title="Welcome to Nuxt Auth with Nuxt UI">
    <template #description>
      <div class="flex flex-col items-center gap-4">
        <UUser
          :name="store.user?.name"
          :description="store.session?.ipAddress"
          :avatar="{
            src: store.user?.image,
          }"
          chip
          size="2xl"
          :ui="{
            description: 'text-start',
          }"
        />
      </div>
    </template>
  </UPageHero>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const store = useAuthStore();
</script>

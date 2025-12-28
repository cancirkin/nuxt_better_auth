<template>
  <UHeader>
    <template #title>
      <div>
        <ClientOnly>
          <NuxtImg
            height="80"
            width="120"
            :src="isDark ? 'nuxt-logo-dark.svg' : 'nuxt-logo.svg'"
          />
        </ClientOnly>
      </div>
    </template>

    <UNavigationMenu :items="headerItems" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Logout">
        <UButton
          class="cursor-pointer"
          icon="i-lucide-log-out"
          size="sm"
          variant="outline"
          @click="logout"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});

const headerItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Profile",
    to: "/profile",
    active: route.path.startsWith("/profile"),
  },
  //   {
  //     label: "Releases",
  //     to: "https://github.com/nuxt/ui/releases",
  //     target: "_blank",
  //   },
]);

const logout = () => {
  authClient.signOut();
  navigateTo("/auth");
};
</script>

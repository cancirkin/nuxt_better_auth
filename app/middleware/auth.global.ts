import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.session) {
    await authStore.fetchSession();
  }

  const session = authStore.session;

  if (!session && to.path.startsWith("/auth") === false) {
    return navigateTo("/auth");
  }

  if (session && to.path === "/auth") {
    return navigateTo("/");
  }
});

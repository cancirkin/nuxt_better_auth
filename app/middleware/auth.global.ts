import { authClient } from "~/utils/auth.client";
export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value && to.path.startsWith("/auth") === false) {
    return navigateTo("/auth");
  }

  if (session.value && to.path === "/auth") {
    return navigateTo("/");
  }
});

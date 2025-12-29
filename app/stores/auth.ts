import { defineStore } from "pinia";
import { authClient } from "~/utils/auth.client";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any | null,
    session: null as any | null,
    loading: false,
  }),
  actions: {
    async fetchSession() {
      this.loading = true;
      try {
        const { data } = await authClient.useSession(useFetch);
        this.session = data.value?.session;
        this.user = data.value?.user || null;
      } catch (error) {
        this.session = null;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
  },
});

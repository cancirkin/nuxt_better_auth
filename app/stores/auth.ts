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
        if (import.meta.server) {
          const { data } = await authClient.useSession(useFetch);
          this.session = data.value?.session;
          this.user = data.value?.user || null;
        } else {
          const { data } = await authClient.getSession();
          this.session = data?.session;
          this.user = data?.user || null;
        }
      } catch (error) {
        this.session = null;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
  },
});

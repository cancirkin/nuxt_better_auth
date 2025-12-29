<template>
  <UPage>
    <UPageBody>
      <SessionsCard v-if="store.session" :session="store.session" highlight />
      <div class="flex justify-between mb-0">
        <h3 class="text-2xl mb-4 font-semibold">Other Sessions</h3>
        <div v-if="hasOtherSessions">
          <UButton
            color="error"
            variant="outline"
            icon="i-lucide-shield-close"
            @click="endAllSessions"
            size="sm"
            >End All Session</UButton
          >
        </div>
      </div>
      <div v-if="hasOtherSessions">
        <SessionsCard
          :class="{
            'mt-4': i > 0,
          }"
          v-for="(session, i) in otherSessions"
          :key="session.id"
          :session="session"
        />
      </div>
      <UEmpty
        v-else
        title="No sessions found"
        description="You have no other active sessions."
      />
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
const store = useAuthStore();

const { data: otherSessions } = await useAsyncData(
  "other-sessions",
  async () => {
    const { data } = await authClient.listSessions();
    return data?.filter((session: any) => session.id !== store.session?.id);
  },
  {
    server: false,
  }
);

const hasOtherSessions = computed(() => {
  return Array.isArray(otherSessions.value) && otherSessions.value.length > 0;
});

const endAllSessions = async () => {
  const toast = useToast();
  await authClient.revokeOtherSessions(undefined, {
    onSuccess: async () => {
      toast.add({
        title: "Sessions ended",
        description: "All other sessions have been successfully ended.",
        icon: "i-lucide-check-circle",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    },
    onError: () => {
      toast.add({
        title: "Error",
        description: "There was an error ending other sessions.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    },
  });
};
</script>

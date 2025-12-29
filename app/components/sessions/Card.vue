<template>
  <UPageCard
    :title="userAgent"
    variant="soft"
    :highlight="highlight"
    icon="i-lucide-monitor"
  >
    <template #description>
      <div>
        <span>Logged: {{ new Date(session.createdAt).toLocaleString() }}</span>
      </div>
      <div>
        <span>Expires: {{ new Date(session.expiresAt).toLocaleString() }}</span>
      </div>
    </template>

    <template #footer>
      <UButton
        v-if="!highlight"
        color="error"
        variant="soft"
        icon="i-lucide-shield-close"
        @click="endSession"
        >End Session</UButton
      >
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
import { UAParser } from "ua-parser-js";

const props = defineProps<{
  session: any;
  highlight?: boolean;
}>();

const userAgent = computed(() => {
  if (!props.session?.userAgent) return "Unknown Device";
  const parser = new UAParser(props.session.userAgent);
  const os = parser.getOS();
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  return `${browser.name} on ${device.vendor ?? "Unknown Device"} (${os.name} ${
    os.version
  })`;
});

const endSession = async () => {
  const toast = useToast();
  await authClient
    .revokeSession({ token: props.session.token })
    .then(async () => {
      toast.add({
        title: "Session ended",
        description: "The session has been successfully ended.",
        icon: "i-lucide-check-circle",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    })
    .catch((err) => {
      toast.add({
        title: "Error",
        description: err.message || "Failed to end session.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    });
};
</script>

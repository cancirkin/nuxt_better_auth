<template>
  <div class="text-center">
    <UIcon name="i-lucide-mail-search" class="size-12" />
  </div>
  <UPageHeader
    title="Check your email"
    :ui="{
      root: 'border-none',
    }"
    description="We've sent a verification link to your email address. Please check your inbox and follow the instructions to verify your account."
  />
  <UButton
    @click="sendVerificationEmailAgain"
    icon="i-lucide-rocket"
    color="neutral"
    :loading="loading"
    :disabled="timeToNextSend > 0"
    >Send Again
    <span v-if="timeToNextSend > 0">- {{ timeToNextSend }}</span>
  </UButton>
</template>

<script setup lang="ts">
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});
const loading = ref(false);
const toast = useToast();
const interval = ref<NodeJS.Timeout | null>(null);
const timeToNextSend = ref(0); // seconds

const startCountdown = () => {
  interval.value = setInterval(() => {
    if (timeToNextSend.value > 0) {
      timeToNextSend.value -= 1;
    } else {
      if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
      }
    }
  }, 1000);
};

const sendVerificationEmailAgain = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
  await authClient.sendVerificationEmail({
    email: props.email,
    callbackURL: "/",
  });
  loading.value = false;
  toast.add({
    title: "Verification Email Sent",
    description: `A verification email has been sent to ${props.email}. Please check your inbox.`,
    icon: "i-lucide-rocket",
  });

  timeToNextSend.value = 60;
  startCountdown();
};
</script>

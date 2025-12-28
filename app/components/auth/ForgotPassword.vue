<template>
  <UPageHeader
    title="Forgot your password?"
    :ui="{
      root: 'border-none pt-0',
    }"
    description="Enter your email address and we'll send you a link to reset your password."
  />
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput class="w-100" v-model="state.email" />
    </UFormField>

    <UButton :loading="loading" block type="submit"> Submit </UButton>
    <UButton @click="emit('open-login-tab')" block variant="outline">
      Cancel
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const toast = useToast();
const state = reactive<Partial<Schema>>({
  email: "",
});
const loading = ref(false);

const emit = defineEmits<{
  (e: "open-login-tab"): void;
}>();

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  new Promise((resolve) => setTimeout(resolve, 2000));
  const data = payload.data;

  await authClient.requestPasswordReset(
    {
      ...data,
      redirectTo: "/auth/reset-password",
    },
    {
      onSuccess: () => {
        loading.value = false;
        toast.add({
          title: "Password Reset Email Sent",
          description: `A password reset email has been sent to ${data.email}. Please check your inbox.`,
          icon: "i-lucide-mail",
        });
      },
      onError: (error) => {
        loading.value = false;
        toast.add({
          title: "Error",
          description: error.error.message,
          icon: "i-lucide-alert-circle",
          color: "error",
        });
      },
    }
  );
}
</script>

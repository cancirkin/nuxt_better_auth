<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UPageHeader
        title="Reset your password"
        :ui="{
          root: 'border-none pt-0',
        }"
        description="Enter your new password below."
      />
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="New Password" name="password">
          <UInput
            class="w-100"
            v-model="state.password"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton :loading="loading" block type="submit"> Submit </UButton>
      </UForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const toast = useToast();
const token = useRoute().query.token as string;
const show = ref(false);
const state = reactive<Partial<Schema>>({
  password: "",
});
const loading = ref(false);

const emit = defineEmits<{
  (e: "open-login-tab"): void;
}>();

const schema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = payload.data;

  await authClient.resetPassword(
    {
      newPassword: data.password,
      token,
    },
    {
      onSuccess: async () => {
        loading.value = false;
        toast.add({
          title: "Password Reset Successful",
          description: "Redirecting to login page...",
          icon: "i-lucide-check-circle",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigateTo("/auth");
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

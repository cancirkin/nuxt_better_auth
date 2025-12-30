<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="on2FaSubmit"
    >
      <UFormField label="Code" name="code">
        <UInput class="w-100" v-model="state.code" :ui="{ trailing: 'pe-1' }">
        </UInput>
      </UFormField>

      <UButton type="submit"> Submit Code </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

type TotpForm = z.infer<typeof schema>;

const state = reactive<{
  code: string;
}>({
  code: "",
});
const schema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .length(6, "Code must be 6 digits"),
});

const on2FaSubmit = async (event: FormSubmitEvent<TotpForm>) => {
  await authClient.twoFactor.verifyTotp(event.data, {
    onSuccess: () => {
      navigateTo("/");
    },
    onError: (error) => {
      const toast = useToast();
      toast.add({
        color: "error",
        title: "2FA Verification Failed",
        description: error.error.message || "Cant verify the provided code.",
      });
    },
  });
};
</script>

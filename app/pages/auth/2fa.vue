<template>
  <div class="flex flex-col items-center justify-center p-4">
    <UPageCard
      variant="subtle"
      title="2FA Code Required"
      description="Enter your 2fa code or use backup codes."
      class="sm:w-100 w-full"
    >
      <UTabs :items="tabItems" variant="link" :ui="{ trigger: 'grow' }">
        <template #code>
          <UForm
            :twoFaCodeSchema="twoFaCodeSchema"
            :state="twoFaCodeState"
            class="space-y-4 mt-4"
            @submit="on2FaSubmit"
          >
            <UFormField label="Code" name="code">
              <UInput
                class="w-full"
                v-model="twoFaCodeState.code"
                :ui="{ trailing: 'pe-1' }"
              >
              </UInput>
            </UFormField>

            <UButton block type="submit"> Submit Code </UButton>
          </UForm>
        </template>
        <template #backup>
          <UForm
            :backupCodeSchema="backupCodeSchema"
            :state="backupCodeState"
            class="space-y-4 mt-4"
            @submit="onBackupCodeSubmit"
          >
            <UFormField label="Backup Code" name="code">
              <UInput
                class="w-full"
                v-model="backupCodeState.code"
                :ui="{ trailing: 'pe-1' }"
              >
              </UInput>
            </UFormField>

            <UButton block type="submit"> Submit Backup Code </UButton>
          </UForm>
        </template>
      </UTabs>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

type TotpForm = z.infer<typeof twoFaCodeSchema>;
type BackupCodeForm = z.infer<typeof backupCodeSchema>;

const tabItems = [
  { label: "Authenticator", slot: "code", icon: "i-lucide-smartphone" },
  { label: "Backup Code", slot: "backup", icon: "i-lucide-shield-check" },
];

const twoFaCodeState = reactive<{
  code: string;
}>({
  code: "",
});
const twoFaCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .length(6, "Code must be 6 digits"),
});

const backupCodeState = reactive<{
  code: string;
}>({
  code: "",
});
const backupCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Backup code is required")
    .length(8, "Backup code must be 8 characters"),
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

const onBackupCodeSubmit = async (event: FormSubmitEvent<BackupCodeForm>) => {
  await authClient.twoFactor.verifyBackupCode(event.data, {
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

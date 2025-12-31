<template>
  <UPage>
    <UPageBody>
      <UPageCard
        v-if="hasCredentialAccount"
        :description="
          showBackupCodes
            ? ''
            : 'For activating 2fa authentication you need the enter your password.'
        "
        variant="subtle"
        title="2FA Authentication"
        :ui="{
          description: 'text-sm',
        }"
        class="max-w-md mx-auto"
      >
        <template #title>
          <div class="flex align-center justify-between gap-2 mb-2">
            <span>2FA Authentication</span>
            <UBadge
              variant="subtle"
              :color="is2FaEnabled ? 'success' : 'error'"
              size="sm"
              >{{ is2FaEnabled ? "Enabled" : "Disabled" }}</UBadge
            >
          </div>
        </template>
        <UForm
          v-if="!twoFactorData"
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="handleFormSubmit"
        >
          <UFormField label="Password" name="password">
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  aria-controls="password"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <UButton
            :color="is2FaEnabled ? 'error' : 'primary'"
            :loading="loading"
            type="submit"
            block
          >
            {{ is2FaEnabled ? "Disable 2FA" : "Enable 2FA" }}
          </UButton>
        </UForm>
        <SecurityQrCode
          v-else-if="twoFactorData && !showBackupCodes"
          :totpURI="twoFactorData.totpURI"
          @submit-token="onQrCodeSubmit"
        ></SecurityQrCode>
        <div v-else>
          <div class="font-bold">Backup Codes</div>
          <div class="text-sm text-toned">
            Save these backup codes in a safe place. You can use them to access
            your account if you lose access to your authenticator app.
          </div>

          <div class="mb-4">
            <ul
              class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-4 list-disc list-inside"
            >
              <li v-for="code in twoFactorData.backupCodes" :key="code">
                <code class="font-mono text-lg">{{ code }}</code>
              </li>
            </ul>
          </div>
          <UButton
            color="primary"
            @click="
              () => {
                showBackupCodes = false;
                twoFactorData = null;
              }
            "
            >Done</UButton
          >
        </div>
      </UPageCard>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useAuthStore } from "~/stores/auth";
const store = useAuthStore();
const toast = useToast();

type Schema = z.output<typeof schema>;
type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};
const twoFactorData = ref<TwoFactorData | null>(null);
const showPassword = ref(false);
const showBackupCodes = ref(false);
const loading = ref(false);
const schema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
const state = reactive<Partial<Schema>>({
  password: "",
});

const { data: accounts } = await useAsyncData(
  "accounts",
  async () => {
    const { data } = await authClient.listAccounts();
    return data;
  },
  {
    server: false,
  }
);

const hasCredentialAccount = computed(() => {
  if (!accounts.value) return false;
  return accounts.value.some(
    (account: any) => account.providerId === "credential"
  );
});

const is2FaEnabled = computed(() => {
  return store.user?.twoFactorEnabled ?? false;
});

const handleFormSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  const data = event.data;
  if (is2FaEnabled.value) {
    await onDisable2Fa(data);
  } else {
    await onEnable2Fa(data);
  }
  loading.value = false;
};

const onEnable2Fa = async (data: Schema) => {
  const result = await authClient.twoFactor.enable({
    password: data.password,
  });

  if (result.error) {
    toast.add({
      title: "Error",
      description: result.error.message || "Failed to enable 2FA.",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  } else {
    twoFactorData.value = result.data;
    state.password = "";
  }
};

const onDisable2Fa = async (data: Schema) => {
  await authClient.twoFactor.disable(
    {
      password: data.password,
    },
    {
      onSuccess: async () => {
        toast.add({
          title: "2FA Disabled",
          description:
            "Two-factor authentication has been disabled on your account.",
          icon: "i-lucide-check-circle",
        });
        state.password = "";
        store.fetchSession();
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.error.message,
          icon: "i-lucide-alert-circle",
          color: "error",
        });
      },
    }
  );
};

const onQrCodeSubmit = async (token: string) => {
  await authClient.twoFactor.verifyTotp(
    { code: token },
    {
      onSuccess: async () => {
        toast.add({
          title: "2FA Enabled",
          description:
            "Two-factor authentication has been enabled on your account.",
          icon: "i-lucide-check-circle",
        });
        showBackupCodes.value = true;
        store.fetchSession();
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.error.message,
          icon: "i-lucide-alert-circle",
          color: "error",
        });
      },
    }
  );
};
</script>

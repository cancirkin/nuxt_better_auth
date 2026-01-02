<template>
  <UPageCard
    title="Passkeys"
    description="Manage your passkeys for easier and secure login."
    variant="subtle"
    class="max-w-md mx-auto mt-4"
  >
    <div class="space-y-4">
      <div v-if="passkeys?.length" class="space-y-2">
        <div
          v-for="passkey in passkeys"
          :key="passkey.id"
          class="flex items-center justify-between p-3 border rounded-lg dark:border-gray-800"
        >
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-key" class="w-5 h-5 text-gray-500" />
            <div>
              <p class="font-medium text-sm">
                {{ passkey.name || "Unnamed Passkey" }}
              </p>
              <p class="text-xs text-gray-500">
                Created: {{ new Date(passkey.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            :loading="deletingId === passkey.id"
            @click="deletePasskey(passkey.id)"
          />
        </div>
      </div>

      <div v-else class="text-sm text-gray-500 text-center py-4">
        No passkeys added yet.
      </div>

      <UButton
        label="Add Passkey"
        icon="i-lucide-plus"
        block
        @click="isModalOpen = true"
      />
    </div>

    <UModal
      v-model:open="isModalOpen"
      title="Add New Passkey"
      description="Create a new passkey for secure access to your account."
    >
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Passkey Name" name="name">
            <UInput
              v-model="state.name"
              placeholder="e.g. MacBook Pro"
              autofocus
            />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="isModalOpen = false"
            />
            <UButton type="submit" label="Create Passkey" :loading="loading" />
          </div>
        </UForm>
      </template>
    </UModal>
  </UPageCard>
</template>

<script setup lang="ts">
import { z } from "zod";
import { authClient } from "~/utils/auth.client";

const toast = useToast();

const isModalOpen = ref(false);
const loading = ref(false);
const deletingId = ref<string | null>(null);

const schema = z.object({
  name: z.string().min(1, "Passkey name is required"),
});

const state = reactive({
  name: "",
});

const { data: passkeys, refresh } = await useAsyncData(
  "passkeys",
  async () => {
    const { data, error } = await authClient.passkey.listUserPasskeys();
    console.log(data);

    if (error) throw error;
    return data;
  },
  {
    server: false,
  }
);

async function onSubmit() {
  loading.value = true;
  try {
    const { error } = await authClient.passkey.addPasskey({
      name: state.name,
    });

    if (error) {
      toast.add({
        title: "Error",
        description: error.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Success",
      description: "Passkey added successfully",
      color: "success",
    });

    isModalOpen.value = false;
    state.name = "";
    refresh();
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Failed to add passkey",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

async function deletePasskey(id: string) {
  deletingId.value = id;
  try {
    const { error } = await authClient.passkey.deletePasskey({
      id,
    });

    if (error) {
      toast.add({
        title: "Error",
        description: error.message,
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Success",
      description: "Passkey deleted successfully",
      color: "success",
    });

    refresh();
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Failed to delete passkey",
      color: "error",
    });
  } finally {
    deletingId.value = null;
  }
}
</script>

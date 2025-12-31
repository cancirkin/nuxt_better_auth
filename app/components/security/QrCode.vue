<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onTokenSubmit"
  >
    <UFormField label="Code" name="token">
      <UInput class="w-full" v-model="state.token" :ui="{ trailing: 'pe-1' }">
      </UInput>
    </UFormField>

    <client-only>
      <QrcodeVue :value="props.totpURI" :size="200" />
    </client-only>

    <UButton type="submit"> Submit Code </UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import QrcodeVue from "qrcode.vue";

type qrForm = z.infer<typeof schema>;

const props = defineProps<{
  totpURI: string;
}>();
const state = reactive<{
  token: string;
}>({
  token: "",
});
const schema = z.object({
  token: z
    .string()
    .min(1, "Token is required")
    .length(6, "Token must be 6 digits"),
});

const emit = defineEmits<{
  (e: "submit-token", token: string): void;
}>();

const onTokenSubmit = (event: FormSubmitEvent<qrForm>) => {
  emit("submit-token", event.data.token);
};
</script>

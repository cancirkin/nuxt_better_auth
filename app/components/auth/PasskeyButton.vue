<template>
  <UButton
    icon="i-lucide-key"
    block
    variant="outline"
    label="Sign in with Passkey"
    :loading="loading"
    @click="signInWithPasskey"
  />
</template>

<script setup lang="ts">
import { authClient } from "~/utils/auth.client";

const toast = useToast();
const router = useRouter();
const loading = ref(false);

async function signInWithPasskey() {
  loading.value = true;
  await authClient.signIn.passkey(undefined, {
    onSuccess: async () => {
      toast.add({
        title: "Success",
        description: "Signed in successfully",
        color: "success",
      });
      await router.push("/");
    },
    onError: (ctx) => {
      toast.add({
        title: "Error",
        description: ctx.error.message,
        color: "error",
      });
    },
  });

  loading.value = false;
}

onMounted(() => {
  authClient.signIn.passkey(
    {
      autoFill: true,
    },
    {
      onSuccess: async () => {
        toast.add({
          title: "Success",
          description: "Signed in successfully",
          color: "success",
        });
        await router.push("/");
      },
      onError: (ctx) => {
        // Autofill errors are usually silent or expected if no passkey is available
        console.debug("Passkey autofill error:", ctx.error.message);
      },
    }
  );
});
</script>

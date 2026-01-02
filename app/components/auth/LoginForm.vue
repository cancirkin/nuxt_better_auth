<template>
  <UAuthForm
    :schema="schema"
    title="Welcome Back"
    description="Enter your credentials to access your account."
    icon="i-lucide-user"
    :fields="fields"
    :providers="providers"
    @submit="onSubmit"
    :ui="{
      root: 'space-y-3',
    }"
  >
    <template #footer>
      <div class="flex flex-col justify-center items-center gap-2">
        <AuthPasskeyButton />
        <UButton @click="onForgotPasswordClick" variant="link"
          >Forgot Password?</UButton
        >
      </div>
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const toast = useToast();

const emit = defineEmits<{
  (e: "open-forgot-tab"): void;
}>();

const onForgotPasswordClick = () => {
  emit("open-forgot-tab");
};

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: async () => {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      console.log(data);
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: async () => {
      const data = await authClient.signIn.social({
        provider: "github",
      });
      console.log(data);
    },
  },
];

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const data = payload.data;
  await authClient.signIn.email(
    {
      email: data.email,
      password: data.password,
      callbackURL: "/",
    },
    {
      onError: ({ error }) => {
        const message =
          error.status === 401
            ? "Check your credentials."
            : "I will notify the team about this issue.";
        toast.add({
          title: "Something went wrong",
          description: message,
          color: "error",
          icon: "i-lucide-x",
        });
        console.error("Login error:", error);
      },
      onSuccess: async () => {
        toast.add({
          title: "Welcome back!",
          description: "I will let you in :)",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigateTo("/");
      },
    }
  );
}
</script>

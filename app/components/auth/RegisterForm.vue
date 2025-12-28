<template>
  <UAuthForm
    :schema="schema"
    title="Create an Account"
    description="Enter your credentials to access your account."
    icon="i-lucide-user"
    :fields="fields"
    :providers="providers"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const toast = useToast();

const emit = defineEmits<{
  (e: "registered", email: string): void;
}>();

const fields: AuthFormField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
  },
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
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const data = payload.data;
  await authClient.signUp.email(
    {
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/",
    },
    {
      onError: () => {
        toast.add({
          title: "Hm, thats weird...",
          description: "I will notify the team about this issue.",
          color: "error",
          icon: "i-lucide-x",
        });
      },
      onSuccess: async () => {
        toast.add({
          title: "Registration successful",
          description: "Welcome aboard!",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        emit("registered", data.email);
      },
    }
  );
}
</script>

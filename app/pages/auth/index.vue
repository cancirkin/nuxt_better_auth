<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <div v-if="activeTab === 'verify'">
        <AuthVerifyEmail :email="email" />
      </div>
      <div v-else-if="activeTab === 'forgot'">
        <AuthForgotPassword @open-login-tab="activeTab = 'login'" />
      </div>
      <UTabs v-else v-model="activeTab" :items="tabItems" class="w-full">
        <template #login>
          <AuthLoginForm @open-forgot-tab="openForgotTab" />
        </template>
        <template #register>
          <AuthRegisterForm @registered="onRegistered" />
        </template>
      </UTabs>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const activeTab = ref("login");
const email = ref("");

const tabItems = [
  { label: "Login", slot: "login", value: "login" },
  { label: "Register", slot: "register", value: "register" },
];

const onRegistered = (registeredEmail: string) => {
  activeTab.value = "verify";
  email.value = registeredEmail;
};

const openForgotTab = () => {
  activeTab.value = "forgot";
};
</script>

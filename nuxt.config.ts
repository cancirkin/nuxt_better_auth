import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image"],
  css: ["~/assets/css/main.css"],
  image: {
    dir: "assets/img",
  },
  alias: {
    "~": fileURLToPath(new URL("./app", import.meta.url)),
    "@": fileURLToPath(new URL("./", import.meta.url)),
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbPassword: process.env.DB_PASSWORD,
    dbUser: process.env.DB_USER,
    dbName: process.env.DB_NAME,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
});

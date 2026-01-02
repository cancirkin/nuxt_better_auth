import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // your drizzle instance
import { sendPasswordResetEmail as sendResetEmail } from "./emails/sendPasswordResetEmail";
import { sendVerificationEmail as sendVerifyEmail } from "./emails/email-verification";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendVerifyEmail({ user, url });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [twoFactor(), passkey()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

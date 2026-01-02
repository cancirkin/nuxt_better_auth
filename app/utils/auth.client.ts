import { createAuthClient } from "better-auth/vue";
import { twoFactorClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }),
    passkeyClient(),
  ],
});

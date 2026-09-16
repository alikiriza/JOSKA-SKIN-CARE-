import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<{ role: string }>()],
});

export const { signIn, signUp, useSession } = authClient;

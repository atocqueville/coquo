import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '@/auth';

export const { signIn, signOut, signUp, useSession } = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
});

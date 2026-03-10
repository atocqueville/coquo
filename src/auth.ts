import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import prisma from '@/lib/prisma';
import { getAuthSecret } from '@/lib/auth-secret';
import { getGoogleCredentials } from '@/lib/auth-config';

// URL publique de l’app (Docker / proxy). Requise pour que le callback OAuth Google soit correct.
const baseURL =
    process.env.OAUTH_AUTH_URL || undefined;

const googleCreds = getGoogleCredentials();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'sqlite',
    }),
    plugins: [admin()],
    secret: getAuthSecret(),
    ...(baseURL && { baseURL }),
    trustedOrigins: async (request) => {
        const origins: string[] = [];
        if (baseURL) {
            try {
                const url = new URL(baseURL);
                origins.push(url.origin);
            } catch {
                // ignore invalid URL
            }
        }
        const origin = request?.headers.get('origin');
        if (origin) origins.push(origin);
        return origins;
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'user',
                input: false,
            },
            locale: {
                type: 'string',
                required: false,
            },
            approved: {
                type: 'boolean',
                defaultValue: false,
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    ...(googleCreds && {
        socialProviders: {
            google: {
                clientId: googleCreds.clientId,
                clientSecret: googleCreds.clientSecret,
            },
        },
    }),
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const usersCount = await prisma.user.count();
                    if (usersCount === 1) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { role: 'admin', approved: true },
                        });
                    }
                },
            },
        },
    },
});

export type Session = typeof auth.$Infer.Session;

// export const { handlers, auth, signIn, signOut } = NextAuth({
//     pages: {
//         signIn: '/auth/login',
//         error: '/auth/error',
//     },
//
//     ...authConfig,
// });

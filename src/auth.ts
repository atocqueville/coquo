import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import prisma from '@/lib/prisma';
import { getAuthSecret } from '@/lib/auth-secret';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'sqlite',
    }),
    plugins: [admin()],
    secret: getAuthSecret(),
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
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const usersCount = await prisma.user.count();
                    if (usersCount === 1) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { role: 'admin', emailVerified: new Date() },
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

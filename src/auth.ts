import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import prisma from '@/lib/prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'sqlite',
    }),
    plugins: [admin()],
    // 🔐 Secret auto-généré et persisté dans /config/auth-secret.txt
    //    secret: getAuthSecret(),
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'USER',
                input: false, // Non modifiable par l'utilisateur
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

// import NextAuth, { type DefaultSession } from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { prisma } from '@/lib/prisma';
// import authConfig from '@/auth.config';
// import { getUserById } from '@/lib/api/user';

// declare module 'next-auth' {
//     interface Session {
//         user: {
//             role?: 'ADMIN' | 'USER';
//             emailVerified?: Date | null;
//             locale?: string | null;
//         } & DefaultSession['user'];
//     }
// }

// export const runtime = 'nodejs';

// export const { handlers, auth, signIn, signOut } = NextAuth({
//     trustHost: true,
//     session: {
//         strategy: 'jwt',
//     },
//     pages: {
//         signIn: '/auth/login',
//         error: '/auth/error',
//     },
//     adapter: PrismaAdapter(prisma),
//     callbacks: {
//         async session({ token, session }) {
//             if (token.sub && session.user) {
//                 session.user.id = token.sub;
//             }

//             if (token.role && session.user) {
//                 session.user.role = token.role as 'ADMIN' | 'USER';
//             }

//             if (session.user) {
//                 session.user.name = token.name;
//                 session.user.email = token.email as string;
//                 session.user.emailVerified = token.emailVerified as Date | null;
//                 session.user.locale = token.locale as string | null;
//             }

//             return session;
//         },
//         async jwt({ token }) {
//             if (!token.sub) return token;

//             const existingUser = await getUserById(token.sub);
//             if (!existingUser) return token;

//             token.name = existingUser.name;
//             token.email = existingUser.email;
//             token.role = existingUser.role;
//             token.emailVerified = existingUser.emailVerified;
//             token.locale = existingUser.locale;
//             return token;
//         },
//     },
//     ...authConfig,
// });

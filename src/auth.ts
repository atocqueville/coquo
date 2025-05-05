import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import { getUser } from '@/lib/api/user';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';

export const runtime = 'nodejs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/api/auth/login',
    },
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                // session.user.role = token.role as string;
            }

            if (session.user) {
                session.user.name = token.name;
                // session.user.email = token.email;
                //   session.user.isOAuth = token.isOAuth as boolean;
                //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            // const existingAccount = await getAccountByUserId(existingUser.id);

            // token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token;
        },
    },
    ...authConfig,
});

import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import authConfig from '@/auth.config';
import { getUserById } from '@/lib/api/user';

declare module 'next-auth' {
    interface Session {
        user: {
            role?: 'ADMIN' | 'USER';
        } & DefaultSession['user'];
    }
}

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
        async signIn({ user }) {
            const existingUser = await getUserById(user.id as string);
            if (!existingUser) throw new Error('User not found');
            if (!existingUser.emailVerified)
                throw new Error('Email not verified');

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as 'ADMIN' | 'USER';
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email as string;
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
    events: {
        async createUser({ user }) {
            const usersCount = await prisma.user.count();
            if (usersCount === 1) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'ADMIN', emailVerified: new Date() },
                });
            }
        },
    },
    ...authConfig,
});

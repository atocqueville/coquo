import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { compare } from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
    trustHost: true,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/api/auth/login',
    },
    callbacks: {
        authorized: async ({ auth }) => !!auth,
        jwt: ({ token, user }) => {
            if (user) token.id = user.id;
            return token;
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                },
            };
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'User E-mail', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user) return null;
                    const passwordsMatch = await compare(
                        password,
                        user.password || ''
                    );
                    if (passwordsMatch) return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});

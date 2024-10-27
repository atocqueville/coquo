import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getUser } from '@/lib/api/user';

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
                    const user = await getUser(parsedCredentials.data);
                    if (user) return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});

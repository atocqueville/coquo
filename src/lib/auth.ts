import { auth } from '@/auth';
import { headers } from 'next/headers';

export const getSession = async () => {
    return auth.api.getSession({
        headers: await headers(),
    });
};

export const currentUser = async () => {
    const session = await getSession();
    return session?.user;
};

export const currentRole = async () => {
    const session = await getSession();
    return session?.user?.role;
};

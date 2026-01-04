import { useSession } from '@/lib/auth-client';

export const useCurrentRole = () => {
    const session = useSession();
    return session.data?.user?.role;
};

import type React from 'react';
import AccountTab from './account';
import { getUserById } from '@/lib/api/user';
import { getSession } from '@/lib/auth';
import type { User } from '@prisma/client';

export default async function AccountWrapper() {
    const session = await getSession();
    const currentUser = await getUserById(session?.user?.id as string);

    return <AccountTab currentUser={currentUser as User} />;
}

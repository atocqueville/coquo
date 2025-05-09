import type React from 'react';
import AccountTab from './account';
import { getUserById } from '@/data/user';
import { auth } from '@/auth';
import type { User } from '@prisma/client';

export default async function AccountWrapper() {
    const session = await auth();
    const currentUser = await getUserById(session?.user?.id as string);

    return <AccountTab currentUser={currentUser as User} />;
}

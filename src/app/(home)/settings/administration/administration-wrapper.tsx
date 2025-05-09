import type React from 'react';
import AdministrationTab from './administration';
import { getBlockedUsers, getUnverifiedUsers } from '@/lib/api/user';

export default async function AdministrationWrapper() {
    const blockedUsersDb = await getBlockedUsers();
    const blockedUsersIds = blockedUsersDb.map((user) => user.id);

    const unverifiedUsersDb = await getUnverifiedUsers();
    const unverifiedUsers = unverifiedUsersDb.filter(
        (user) => !blockedUsersIds.includes(user.id)
    );

    return (
        <AdministrationTab
            unverifiedUsers={unverifiedUsers}
            blockedUsers={blockedUsersDb}
        />
    );
}

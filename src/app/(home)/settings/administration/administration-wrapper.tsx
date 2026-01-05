import AdministrationTab from './administration';
import { getBlockedUsers, getPendingUsers } from '@/lib/api/user';

export default async function AdministrationWrapper() {
    const blockedUsersDb = await getBlockedUsers();
    const blockedUsersIds = blockedUsersDb.map((user) => user.id);

    const pendingUsersDb = await getPendingUsers();
    const pendingUsers = pendingUsersDb.filter(
        (user) => !blockedUsersIds.includes(user.id)
    );

    return (
        <AdministrationTab
            pendingUsers={pendingUsers}
            blockedUsers={blockedUsersDb}
        />
    );
}

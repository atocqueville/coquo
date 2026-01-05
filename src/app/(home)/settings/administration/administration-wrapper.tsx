import AdministrationTab from './administration';
import { getBannedUsers, getPendingUsers } from '@/lib/api/user';

export default async function AdministrationWrapper() {
    const bannedUsers = await getBannedUsers();
    const blockedUsersIds = bannedUsers.map((user) => user.id);

    const pendingUsersDb = await getPendingUsers();
    const pendingUsers = pendingUsersDb.filter(
        (user) => !blockedUsersIds.includes(user.id)
    );

    return (
        <AdministrationTab
            pendingUsers={pendingUsers}
            blockedUsers={bannedUsers}
        />
    );
}

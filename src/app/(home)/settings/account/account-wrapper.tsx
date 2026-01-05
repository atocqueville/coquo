import AccountTab from './account';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AccountWrapper() {
    const user = await currentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return <AccountTab currentUser={user} />;
}

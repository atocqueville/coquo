import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';
import { MobileNavbar } from '@/components/navbar/mobile-navbar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function CookBookLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();

    // If user is logged in but email is not verified (and not admin), redirect to error page
    if (session?.user) {
        const isEmailVerified =
            !!session.user.emailVerified || session.user.role === 'ADMIN';
        if (!isEmailVerified) {
            redirect('/auth/error');
        }
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="w-full flex h-screen">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                    <main className="flex-1">{children}</main>
                    <MobileNavbar />
                </div>
            </div>
        </SidebarProvider>
    );
}

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';
import { SessionProvider } from 'next-auth/react';
import { MobileNavbar } from '@/components/navbar/mobile-navbar';

export default function CookBookLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <SidebarProvider defaultOpen={false}>
                <div className="w-full flex h-screen">
                    <AppSidebar />
                    <div className="flex flex-col flex-1">
                        <main className="flex-1">{children}</main>
                        <MobileNavbar />
                    </div>
                </div>
            </SidebarProvider>
        </SessionProvider>
    );
}

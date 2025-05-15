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
                <AppSidebar />
                <main className="w-full md:h-full">{children}</main>
                <MobileNavbar />
            </SidebarProvider>
        </SessionProvider>
    );
}

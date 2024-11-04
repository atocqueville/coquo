import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';
import { SessionProvider } from 'next-auth/react';

export default function CookBookLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <main className="w-full">{children}</main>
            </SidebarProvider>
        </SessionProvider>
    );
}

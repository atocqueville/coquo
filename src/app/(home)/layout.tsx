import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';
import { SessionProvider } from 'next-auth/react';

export default function CookBookLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <SidebarProvider
                defaultOpen={false}
                style={
                    {
                        '--sidebar-background': '217.2 91.2% 59.8%',
                        '--sidebar-foreground': '0 0% 100%',
                        '--sidebar-primary': '0 0% 100%',
                        '--sidebar-primary-foreground': '217.2 91.2% 59.8%',
                        '--sidebar-accent': '217.2 91.2% 65%',
                        '--sidebar-accent-foreground': '0 0% 100%',
                        '--sidebar-border': '217.2 91.2% 55%',
                    } as React.CSSProperties
                }
            >
                <AppSidebar />
                <main className="w-full">{children}</main>
            </SidebarProvider>
        </SessionProvider>
    );
}

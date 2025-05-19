'use client';

import { Settings } from 'lucide-react';
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { appRoutes } from '@/routes';

export function SidebarLinks() {
    const pathname = usePathname();

    return (
        <>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {appRoutes
                                .filter((item) => item.href !== '/settings')
                                .map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.href}
                                            disabled={pathname === item.href}
                                            className="transition-colors duration-200"
                                        >
                                            <a href={item.href}>
                                                <item.icon
                                                    className={`transition-all duration-200 ${
                                                        pathname === item.href
                                                            ? ''
                                                            : 'text-sidebar-foreground hover:scale-110'
                                                    }`}
                                                />
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname === '/settings'}
                            disabled={pathname === '/settings'}
                            className="transition-colors duration-200"
                        >
                            <a href={'/settings'}>
                                <Settings
                                    className={`transition-all duration-200 ${
                                        pathname === '/settings'
                                            ? ''
                                            : 'text-sidebar-foreground hover:scale-110'
                                    }`}
                                />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </>
    );
}

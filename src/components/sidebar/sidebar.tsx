'use client';

import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { SidebarLinks } from '@/components/sidebar/sidebar-links';

export function AppSidebar() {
    return (
        <div className="z-20 bg-background">
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={'/blue-banana_192.png'}
                                    alt="coquo logo"
                                />
                            </Avatar>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarLinks />
            </Sidebar>
        </div>
    );
}

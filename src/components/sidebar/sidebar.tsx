import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/lib/auth';
import { SidebarLinks } from '@/components/sidebar/sidebar-links';

export async function AppSidebar() {
    const user = await currentUser();

    return (
        <div className="z-20 border-r border-border bg-background">
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={user?.image as string}
                                    alt="user image profile"
                                />
                                <AvatarFallback>
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarLinks />
            </Sidebar>
        </div>
    );
}

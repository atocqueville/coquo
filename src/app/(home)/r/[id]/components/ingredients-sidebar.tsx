'use client';

import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CrossableCheckbox } from '@/components/ui/crossable-checkbox';

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="relative z-50">
            <div className="absolute right-0 top-20">
                <Button onClick={toggleSidebar}>Toggle Sidebar</Button>
            </div>
        </div>
    );
}

export function IngredientSidebar({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            defaultOpen={true}
            style={
                {
                    '--sidebar-width': '500px',
                    '--sidebar-width-mobile': '20rem',
                    '--sidebar-background': '100 100% 100%',
                    '--sidebar-foreground': '100 0% 0%',
                } as React.CSSProperties
            }
        >
            <ScrollArea className="h-screen w-full" type="scroll">
                <main>{children}</main>
            </ScrollArea>

            <Sidebar side="right">
                <SidebarHeader className="p-0">
                    <div className="border-b">
                        <h3 className="mt-8 mb-4 text-center text-4xl font-bold leading-[1.2] tracking-tight">
                            Ingrédients
                        </h3>
                    </div>
                </SidebarHeader>
                <ScrollArea className="h-full w-full" type="scroll">
                    <div className="m-8">
                        {Array.from({ length: 50 }, (v, k) => (
                            <CrossableCheckbox id={k + 'id'} key={k}>
                                Ingrédient random {k}
                            </CrossableCheckbox>
                        ))}
                    </div>
                </ScrollArea>
            </Sidebar>
        </SidebarProvider>
    );
}

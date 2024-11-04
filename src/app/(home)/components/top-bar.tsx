'use client';

import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
    return (
        <div className="flex items-center gap-2 h-12 top-4 sticky top-0">
            <Drawer.Root direction="left">
                <Drawer.Trigger
                    asChild
                    className="relative flex h-10 flex-shrink-0 items-center rounded-full px-4 text-sm shadow-sm border-black"
                >
                    <Button variant="outline">Filtres</Button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content
                        className="top-0 bottom-0 fixed z-10 outline-none w-[310px] flex"
                        style={
                            {
                                left: '3rem',
                                '--initial-transform': 'calc(100% + 3rem)',
                            } as React.CSSProperties
                        }
                    >
                        <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-r-[16px]">
                            <div className="max-w-md mx-auto">
                                <Drawer.Title className="font-medium mb-2 text-zinc-900">
                                    Filtres
                                </Drawer.Title>
                                <Drawer.Description className="text-zinc-600 mb-2">
                                    Filtres input ici
                                </Drawer.Description>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

            <Input
                className="rounded-full bg-white"
                placeholder="Rechercher une recette..."
            />
        </div>
    );
}

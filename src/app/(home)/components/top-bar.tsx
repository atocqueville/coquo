'use client';

import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

export default function TopBar() {
    return (
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="container flex items-center justify-between h-16 px-4">
                <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                    Mes recettes
                </h1>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher"
                            className="pl-8"
                        />
                    </div>
                    <Drawer.Root direction="right">
                        <Drawer.Trigger
                            asChild
                            className="relative flex flex-shrink-0 items-center px-4 text-sm shadow-sm"
                        >
                            <Button className="h-9 w-9 sm:px-4 sm:py-2 sm:w-auto">
                                <span className="hidden sm:block">
                                    Recherche avancée
                                </span>
                                <Filter />
                            </Button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-20" />
                            <Drawer.Content
                                className="top-0 bottom-0 fixed z-30 outline-none w-[350px] flex"
                                style={{ right: '0rem' }}
                            >
                                <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col">
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
                </div>
            </div>
        </header>
    );
}

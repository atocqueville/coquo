'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { appRoutes } from '@/routes';
import { useIsMobile } from '@/hooks/use-mobile';

export interface Route {
    href: string;
    icon: React.ReactNode;
    label: string;
}

interface MobileNavbarProps {
    className?: string;
}

export function MobileNavbar({ className }: MobileNavbarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    // If not mobile, don't render the navbar
    if (!isMobile) return null;

    // Show first 3 routes in the navbar, rest go in the "more" menu
    const visibleRoutes = appRoutes.slice(0, 3);
    const moreRoutes = appRoutes.length > 3 ? appRoutes.slice(3) : [];
    const hasMoreRoutes = moreRoutes.length > 0;

    return (
        <div
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-[hsl(210,60%,32%)] border-t bg-sidebar pb-safe',
                className
            )}
        >
            {visibleRoutes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className="flex h-full w-full flex-col items-center justify-center text-sidebar-foreground"
                >
                    <div
                        className={cn(
                            'flex items-center justify-center',
                            pathname === route.href
                                ? 'h-10 w-10 bg-sidebar-accent rounded-md'
                                : 'h-6 w-6'
                        )}
                    >
                        <route.icon />
                    </div>
                    <span className="sr-only">{route.label}</span>
                </Link>
            ))}

            {hasMoreRoutes && (
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="flex h-full w-full flex-col items-center justify-center text-sidebar-foreground"
                            aria-label="Plus d'options"
                        >
                            <div className="flex h-6 w-6 items-center justify-center">
                                <MoreHorizontal className="h-5 w-5" />
                            </div>
                            <span className="sr-only">Plus</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="h-auto rounded-t-xl pb-safe bg-sidebar border-t-0"
                    >
                        <SheetHeader className="text-left">
                            <VisuallyHidden asChild>
                                <SheetTitle>Plus d&apos;options</SheetTitle>
                            </VisuallyHidden>
                        </SheetHeader>
                        <div className="grid grid-cols-4 gap-4 py-4">
                            {moreRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="flex flex-col items-center justify-center rounded-md p-3 text-center text-sidebar-foreground"
                                    onClick={() => setOpen(false)}
                                >
                                    <div
                                        className={cn(
                                            'flex items-center justify-center mb-1',
                                            pathname === route.href
                                                ? 'h-10 w-10 bg-sidebar-accent rounded-md'
                                                : 'h-6 w-6'
                                        )}
                                    >
                                        <route.icon />
                                    </div>
                                    <span className="text-xs">
                                        {route.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}

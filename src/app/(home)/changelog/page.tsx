import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ChangelogContent } from './changelog-content';

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container py-4 px-4 md:py-6">
                <div className="mb-4 flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Retour</span>
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold">
                        Journal des modifications
                    </h1>
                </div>

                <div className="max-w-3xl">
                    <ChangelogContent />
                </div>
            </div>
        </div>
    );
}

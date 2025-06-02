'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();

    return (
        <div className="absolute top-4 left-4 z-20">
            <Button
                onClick={() => router.back()}
                variant="coquo"
                size="icon"
                className="rounded-full shadow-lg"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Retour à la liste des recettes</span>
            </Button>
        </div>
    );
}

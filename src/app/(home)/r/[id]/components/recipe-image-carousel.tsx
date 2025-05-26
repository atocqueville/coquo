'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type RecipeImageCarouselProps = {
    images: Array<{ id: number; path: string; order: number }>;
};

export default function RecipeImageCarousel({
    images,
}: RecipeImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length
        );
    };

    if (images.length === 0) return null;

    return (
        <div className="relative h-full w-full">
            <Image
                src={`/api/image-proxy?imageId=${images[currentImageIndex].path}`}
                alt={`Recipe image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
            />

            {images.length > 1 && (
                <>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Image précédente</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                        onClick={nextImage}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Image suivante</span>
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    'h-2 w-2 rounded-full transition-all',
                                    index === currentImageIndex
                                        ? 'bg-white'
                                        : 'bg-white/50 hover:bg-white/75'
                                )}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

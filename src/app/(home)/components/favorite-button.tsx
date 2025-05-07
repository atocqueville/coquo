'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { toggleFavorite } from '@/lib/api/recipe';

export default function FavoriteButton({
    recipeId,
    userStarredIds,
}: {
    recipeId: number;
    userStarredIds: number[];
}) {
    const [isFavorite, setIsFavorite] = useState(
        userStarredIds.includes(recipeId)
    );

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const previous = isFavorite;
        setIsFavorite(!previous);

        toggleFavorite(recipeId)
            .then(() => {
                toast.success(
                    previous
                        ? 'Recette retirée des favoris'
                        : 'Recette ajoutée aux favoris'
                );
            })
            .catch(() => {
                setIsFavorite(previous);
                toast.error('Une erreur est survenue. Veuillez réessayer.');
            });
    };

    return (
        <button
            onClick={handleToggle}
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center"
        >
            <Heart
                className={`h-4 w-4 transition-colors stroke-white hover:fill-red-200 ${
                    isFavorite
                        ? 'fill-red-500 stroke-red-500'
                        : 'text-muted-foreground'
                }`}
            />
        </button>
    );
}

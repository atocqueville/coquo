'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { toggleFavorite } from '@/lib/api/recipe';

export default function FavoriteButton({
    recipeId,
    userStarredIds,
}: {
    recipeId: number;
    userStarredIds: number[];
}) {
    const t = useTranslations('common.FavoriteButton');
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
                toast.success(previous ? t('removed') : t('added'));
            })
            .catch(() => {
                setIsFavorite(previous);
                toast.error(t('error'));
            });
    };

    return (
        <button
            onClick={handleToggle}
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center"
        >
            <Heart
                color={isFavorite ? '#fb2c36' : '#fff'}
                className={`hover:fill-red-400  ${
                    isFavorite
                        ? 'fill-red-500 stroke-red-500'
                        : 'text-muted-foreground'
                }`}
            />
        </button>
    );
}

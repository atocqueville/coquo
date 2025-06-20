import RecipeItem from './recipe-item';
import type { RecipeWithTagsAndAuthor } from '@/lib/api/recipe';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function RecipeList({
    recipes,
    children,
    isFavorite,
}: {
    recipes: RecipeWithTagsAndAuthor[];
    children?: React.ReactNode;
    isFavorite?: boolean;
}) {
    const t = await getTranslations('RecipeList.emptyState');
    const hasRecipes = recipes.length > 0;

    return (
        <section className="flex-1 container">
            {hasRecipes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeItem key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center sm:py-16 px-4 text-center">
                    <div className="relative w-full h-64 sm:w-96 sm:h-96 mb-6">
                        <Image
                            src="/empty-plate.png"
                            alt="No recipes found"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {t('noRecipesFound')}
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        {isFavorite ? t('noFavorites') : t('noResults')}
                    </p>
                </div>
            )}
            {children}
        </section>
    );
}

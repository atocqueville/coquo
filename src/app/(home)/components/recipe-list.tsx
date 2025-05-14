import RecipeItem from './recipe-item';
import type { RecipeWithTagsAndAuthor } from '@/lib/api/recipe';
import Image from 'next/image';

export default function RecipeList({
    recipes,
    children,
}: {
    recipes: RecipeWithTagsAndAuthor[];
    children?: React.ReactNode;
}) {
    const hasRecipes = recipes.length > 0;

    return (
        <main className="flex-1 container px-4 py-6">
            {hasRecipes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeItem key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center sm:py-16 px-4 text-center">
                    <div className="relative w-96 h-96 mb-6">
                        <Image
                            src="/empty-plate.png"
                            alt="No recipes found"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        Aucune recette trouvée
                    </h3>
                    {children}
                </div>
            )}
        </main>
    );
}

import RecipeList from '@/app/(home)/components/recipe-list';
import { getStarredRecipes } from '@/lib/api/recipe';

export const dynamic = 'force-dynamic';

export default async function FavoritePage() {
    const recipes = await getStarredRecipes();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="container flex items-center justify-between h-16 px-4">
                    <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                        Mes recettes enregistrées
                    </h1>
                </div>
            </header>
            <RecipeList recipes={recipes}>
                <p className="text-muted-foreground max-w-md mb-6">
                    Vous n&apos;avez pas de recettes enregistrées. Ajoutez des
                    recettes à vos favoris pour les retrouver ici.
                </p>
            </RecipeList>
        </div>
    );
}

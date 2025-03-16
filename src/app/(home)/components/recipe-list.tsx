import { getRecipes } from '@/lib/api/recipe';
import RecipeItem from './recipe-item';

export default async function RecipeList() {
    const recipes = await getRecipes();

    return (
        <main className="flex-1 container px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                    <RecipeItem key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </main>
    );
}

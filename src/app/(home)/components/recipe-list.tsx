import { getRecipes } from '@/lib/api/recipe';
import Recipe from './recipe';

export default async function RecipeList() {
    const recipes = await getRecipes();

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
                <Recipe key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
}
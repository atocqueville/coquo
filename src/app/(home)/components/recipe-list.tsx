import { getRecipes } from '@/lib/api/recipe';
import RecipeItem from './recipe-item';

export default async function RecipeList() {
    const recipes = await getRecipes();

    return (
        <div className="mx-8 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
                <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
}

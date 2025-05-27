import { getTags } from '@/lib/api/tags';
import { getRecipeById } from '@/lib/api/recipe';
import { CreateRecipeForm } from '../../../create/components/create-recipe-form';

export const dynamic = 'force-dynamic';

export default async function EditRecipePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const tags = await getTags();
    const recipe = await getRecipeById(id);

    // Convert recipe to form format expected by CreateRecipeForm
    const initialData = {
        title: recipe.title,
        images: recipe.images?.map((img) => img.path) || [],
        ingredients: recipe.ingredients.join('\n'),
        steps: recipe.steps.map((step) => ({
            title: step.title,
            instructions: step.instructions,
        })),
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        tags: recipe.tags.map((tag) => tag.id),
    };

    return (
        <div className="flex flex-col">
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="container flex items-center justify-between h-16 px-4">
                    <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                        Modifier la recette
                    </h1>
                </div>
            </header>
            <section className="flex-1 container px-4 py-6">
                <CreateRecipeForm
                    tags={tags}
                    initialData={initialData}
                    recipeId={Number(id)}
                />
            </section>
        </div>
    );
}

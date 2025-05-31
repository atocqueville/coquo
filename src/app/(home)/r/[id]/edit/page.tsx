import { getTags } from '@/lib/api/tags';
import { getRecipeById } from '@/lib/api/recipe';
import { CreateRecipeForm } from '@/app/(home)/create/components/create-recipe-form';
import { PageContainer, PageTitle } from '@/components/page-wrapper';
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
        <PageContainer>
            <PageTitle title="Créer une nouvelle recette" />
            <CreateRecipeForm
                tags={tags}
                initialData={initialData}
                recipeId={Number(id)}
            />
        </PageContainer>
    );
}

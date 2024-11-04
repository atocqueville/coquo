import { getRecipeById } from '@/lib/api/recipe';
import Recipe from './components/recipe';

export default async function RecipePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    const recipe = await getRecipeById(id);

    return <Recipe recipe={recipe} />;
}

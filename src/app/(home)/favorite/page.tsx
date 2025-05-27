import RecipeList from '@/app/(home)/components/recipe-list';
import { getStarredRecipes } from '@/lib/api/recipe';
import { PageContainer, PageTitle } from '@/components/page-wrapper';

export const dynamic = 'force-dynamic';

export default async function FavoritePage() {
    const recipes = await getStarredRecipes();

    return (
        <PageContainer>
            <PageTitle title="Mes recettes enregistrées" />
            <RecipeList recipes={recipes} isFavorite></RecipeList>
        </PageContainer>
    );
}

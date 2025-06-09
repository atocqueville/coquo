import RecipeList from '@/app/(home)/components/recipe-list';
import { getStarredRecipes } from '@/lib/api/recipe';
import { PageContainer, PageTitle } from '@/components/page-wrapper';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function FavoritePage() {
    const recipes = await getStarredRecipes();
    const t = await getTranslations('FavoritePage');

    return (
        <PageContainer>
            <PageTitle title={t('title')} />
            <RecipeList recipes={recipes} isFavorite></RecipeList>
        </PageContainer>
    );
}

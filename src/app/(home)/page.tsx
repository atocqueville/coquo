import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';
import { getTags } from '@/lib/api/tags';
import { getRecipes } from '@/lib/api/recipe';
import { getAllRecipeAuthors } from '@/lib/api/user';

import RecipePagination from './components/recipe-pagination';
import { PageContainer } from '@/components/page-wrapper';

export const dynamic = 'force-dynamic';

export default async function CookBookPage(props: {
    searchParams?: Promise<{
        tags?: string;
        q?: string;
        user?: string;
        page?: string;
    }>;
}) {
    /** Extract params from searchParams */
    const searchParams = await props.searchParams;
    const currentPage = parseInt(searchParams?.page || '1', 10);

    /** Get recipes and count for pagination */
    const recipes = await getRecipes(searchParams || {});

    /** Get filter options tags */
    const tagsDb = await getTags();
    const authors = await getAllRecipeAuthors();

    /** Build pagination URL with current filters */
    const buildPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams();
        if (searchParams?.tags) params.set('tags', searchParams.tags);
        if (searchParams?.q) params.set('q', searchParams.q);
        if (searchParams?.user) params.set('user', searchParams.user);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <PageContainer>
            <TopBar tags={tagsDb} authors={authors} />
            <RecipeList recipes={recipes}>
                <RecipePagination
                    currentPage={currentPage}
                    buildPageUrl={buildPageUrl}
                    searchParams={searchParams}
                />
            </RecipeList>
        </PageContainer>
    );
}

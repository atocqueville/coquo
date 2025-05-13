import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';
import { getTags } from '@/lib/api/tags';
import { getRecipes } from '@/lib/api/recipe';

export const dynamic = 'force-dynamic';

export default async function CookBookPage(props: {
    searchParams?: Promise<{
        tags?: string;
        page?: string;
    }>;
}) {
    // Extract tags from searchParams
    const searchParams = await props.searchParams;
    const selectedTags = searchParams?.tags?.split(',') || [];
    /** Apply filters to getRecipes */
    const recipes = await getRecipes({ tags: selectedTags });

    /** Get all tags */
    const tagsDb = await getTags();

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar tags={tagsDb} />
            <RecipeList recipes={recipes} />
        </div>
    );
}

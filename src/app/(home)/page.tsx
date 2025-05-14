import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';
import { getTags } from '@/lib/api/tags';
import { getRecipes, getRecipeCount } from '@/lib/api/recipe';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 10;

export default async function CookBookPage(props: {
    searchParams?: Promise<{
        tags?: string;
        q?: string;
        page?: string;
    }>;
}) {
    /** Extract params from searchParams */
    const searchParams = await props.searchParams;
    const currentPage = parseInt(searchParams?.page || '1', 10);

    /** Get recipes and count for pagination */
    const recipes = await getRecipes(searchParams || {});
    const totalRecipes = await getRecipeCount(searchParams || {});
    const totalPages = Math.ceil(totalRecipes / ITEMS_PER_PAGE);

    /** Get all tags */
    const tagsDb = await getTags();

    /** Build pagination URL with current filters */
    const buildPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams();
        if (searchParams?.tags) params.set('tags', searchParams.tags);
        if (searchParams?.q) params.set('q', searchParams.q);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar tags={tagsDb} />
            <RecipeList recipes={recipes} />

            {totalPages > 1 && (
                <Pagination className="my-6">
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={buildPageUrl(currentPage - 1)}
                                />
                            </PaginationItem>
                        )}

                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                                // Logic to show current page and nearby pages
                                let pageNumber: number;

                                if (totalPages <= 5) {
                                    // Show all pages if 5 or fewer
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    // Near start: show first 5 pages
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    // Near end: show last 5 pages
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    // In middle: show current and 2 on each side
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href={buildPageUrl(pageNumber)}
                                            isActive={
                                                pageNumber === currentPage
                                            }
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href={buildPageUrl(totalPages)}
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    href={buildPageUrl(currentPage + 1)}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { getRecipeCount } from '@/lib/api/recipe';

const ITEMS_PER_PAGE = 10;

export default async function RecipePagination({
    currentPage,
    buildPageUrl,
    searchParams,
}: {
    currentPage: number;
    buildPageUrl: (page: number) => string;
    searchParams?: {
        tags?: string;
        q?: string;
        page?: string;
    };
}) {
    const totalRecipes = await getRecipeCount(searchParams || {});
    const totalPages = Math.ceil(totalRecipes / ITEMS_PER_PAGE);

    return (
        <>
            {totalPages > 1 && (
                <Pagination className="mt-6 mb-16 md:mt-8 md:mb-0">
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
        </>
    );
}

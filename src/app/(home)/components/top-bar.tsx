'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MultiSelect } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import { badgeLabel } from '@/components/ui/badge';
import type { Tag } from '@prisma/client';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

export default function TopBar({ tags }: { tags: Tag[] }) {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const tagOptions = tags.map((tag) => ({
        value: tag.id,
        variant: tag.name,
        label: badgeLabel[tag.name as keyof typeof badgeLabel],
    }));

    // Load saved filters from cookies and sync with URL on initial render
    useEffect(() => {
        try {
            // Get current URL params
            const url = new URL(window.location.href);
            const urlTagsParam = url.searchParams.get('tags');
            const urlSearchParam = url.searchParams.get('q');
            const urlTags = urlTagsParam ? urlTagsParam.split(',') : [];

            // Get cookies filters
            const cookies = parseCookies();
            const cookieFilters = cookies.recipeFilters;
            let cookieTags: string[] = [];
            let cookieSearch: string = '';

            if (cookieFilters) {
                const parsed = JSON.parse(cookieFilters);
                cookieTags = parsed.tags || [];
                cookieSearch = parsed.search || '';
            }

            // Determine which tags to use (URL has priority)
            if (urlTags.length > 0 || urlSearchParam) {
                // URL has params, update cookies and state
                setSelectedTags(urlTags);
                if (urlSearchParam) setSearchQuery(urlSearchParam);

                setCookie(
                    null,
                    'recipeFilters',
                    JSON.stringify({
                        tags: urlTags,
                        search: urlSearchParam || '',
                    }),
                    {
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                        path: '/',
                    }
                );
            } else if (cookieTags.length > 0 || cookieSearch) {
                // No URL params but we have cookie values, update URL and state
                setSelectedTags(cookieTags);
                if (cookieSearch) setSearchQuery(cookieSearch);

                const params = new URLSearchParams();
                if (cookieTags.length > 0)
                    params.set('tags', cookieTags.join(','));
                if (cookieSearch) params.set('q', cookieSearch);
                router.push(`?${params.toString()}`);
            }
        } catch (error) {
            console.error('Error syncing filters:', error);
        }
    }, [router]); // Include the router since it's used inside the effect

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            // Update URL and cookies with the new search query
            const params = new URLSearchParams(window.location.search);

            if (value) {
                params.set('q', value);
            } else {
                params.delete('q');
            }

            // Preserve existing tag filters
            if (selectedTags.length > 0 && !params.has('tags')) {
                params.set('tags', selectedTags.join(','));
            }

            // Save to cookie
            setCookie(
                null,
                'recipeFilters',
                JSON.stringify({
                    tags: selectedTags,
                    search: value,
                }),
                {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                }
            );

            // Update URL
            router.push(`?${params.toString()}`);
        }, 500),
        [selectedTags, router]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        console.log('searchQuery', value);
        debouncedSearch(value);
    };

    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
    };

    const saveFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Save to cookie
        setCookie(
            null,
            'recipeFilters',
            JSON.stringify({
                tags: selectedTags,
                search: searchQuery,
            }),
            {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            }
        );

        // Close the popover
        setIsPopoverOpen(false);

        // Update URL with all current filters
        const params = new URLSearchParams();
        if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
        if (searchQuery) params.set('q', searchQuery);

        // Simply redirect to homepage - middleware will handle adding filters
        router.push(params.toString() ? `/?${params.toString()}` : '/');
    };

    const resetFilters = () => {
        destroyCookie(null, 'recipeFilters', { path: '/' });

        // Reset state
        setSelectedTags([]);
        setSearchQuery('');

        // Close the popover
        setIsPopoverOpen(false);

        // Simply redirect to homepage
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="container flex items-center justify-between h-16 px-4">
                <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                    Mes recettes
                </h1>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher"
                            className="pl-8"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`h-9 w-9 sm:px-4 sm:py-2 sm:w-auto ${
                                    selectedTags.length > 0
                                        ? 'bg-emerald-400 hover:bg-emerald-400/80 border-secondary text-primary relative'
                                        : ''
                                }`}
                            >
                                <span className="hidden sm:block">
                                    Recherche avancée
                                </span>
                                <Filter
                                    className={
                                        selectedTags.length > 0
                                            ? 'text-primary'
                                            : ''
                                    }
                                />
                                {selectedTags.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] rounded-full flex items-center justify-center text-primary-foreground">
                                        {selectedTags.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <form onSubmit={saveFilters}>
                                <div className="space-y-4">
                                    <h3 className="font-medium text-base">
                                        Filtres
                                    </h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="tags-filter">
                                            Tags
                                        </Label>
                                        <MultiSelect
                                            id="tags-filter"
                                            options={tagOptions}
                                            onValueChange={handleTagsChange}
                                            defaultValue={selectedTags}
                                            placeholder="Sélectionner des tags"
                                        />
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={resetFilters}
                                            className="mr-2"
                                        >
                                            Réinitialiser
                                        </Button>
                                        <Button type="submit" size="sm">
                                            Appliquer
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

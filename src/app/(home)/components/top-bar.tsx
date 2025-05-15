/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { badgeLabel } from '@/components/ui/badge';
import type { Tag } from '@prisma/client';
import { setCookie, destroyCookie } from 'nookies';
import { AdvancedSearchButton } from './advanced-search-button';

export default function TopBar({ tags }: { tags: Tag[] }) {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const tagOptions = tags.map((tag) => ({
        value: tag.id,
        variant: tag.name,
        label: badgeLabel[tag.name as keyof typeof badgeLabel],
    }));

    /** SAVE FILTERS TO COOKIE AND REFRESH URL */
    const saveFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setCookie(
            null,
            'recipeFilters',
            JSON.stringify({
                tags: selectedTags,
                q: searchQuery,
                page: '1',
            }),
            {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            }
        );

        router.push('/');
    };

    /** INITIAL LOAD TO MAKE FILTERS SYNC WITH URL */
    useEffect(() => {
        try {
            // Get current URL params
            const url = new URL(window.location.href);
            const urlTagsParam = url.searchParams.get('tags');
            const urlSearchParam = url.searchParams.get('q');
            const urlTags = urlTagsParam ? urlTagsParam.split(',') : [];
            const urlPageParam = url.searchParams.get('page');

            // Determine which tags to use (URL has priority)
            if (urlTags.length > 0 || urlSearchParam || urlPageParam) {
                // URL has params, update cookies and state
                setSelectedTags(urlTags);
                if (urlSearchParam) setSearchQuery(urlSearchParam);

                setCookie(
                    null,
                    'recipeFilters',
                    JSON.stringify({
                        tags: urlTags,
                        q: urlSearchParam || '',
                        page: urlPageParam || '1',
                    }),
                    {
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                        path: '/',
                    }
                );
            }
        } catch (error) {
            console.error('Error syncing filters:', error);
        }
    }, [router]);

    /** TRIGGER SAVE FILTERS AND REFRESH URL */
    useEffect(() => {
        saveFilters();
    }, [selectedTags]);

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
                    q: value,
                    page: '1',
                }),
                {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                }
            );

            // Update URL
            router.push(`/`);
        }, 500),
        [selectedTags, router]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
    };

    const resetFilters = () => {
        destroyCookie(null, 'recipeFilters');

        // Reset state
        setSelectedTags([]);
        setSearchQuery('');

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
                    <AdvancedSearchButton
                        selectedTags={selectedTags}
                        tagOptions={tagOptions}
                        onTagsChange={handleTagsChange}
                        onResetFilters={resetFilters}
                    />
                </div>
            </div>
        </header>
    );
}

// Debounce utility function
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

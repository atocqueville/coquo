/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Tag, User } from '@prisma/client';
import { setCookie, destroyCookie } from 'nookies';
import { AdvancedSearchButton } from './advanced-search-button';

interface FilterState {
    tags: string[];
    user: string;
    q: string;
    page: string;
}

export default function TopBar({
    tags,
    users,
}: {
    tags: Tag[];
    users: User[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [selectedTags, setSelectedTags] = useState<string[]>(() => {
        const urlTags = searchParams.get('tags');
        return urlTags ? urlTags.split(',') : [];
    });

    const [selectedUser, setSelectedUser] = useState<string>(() => {
        return searchParams.get('user') || '';
    });

    const [searchQuery, setSearchQuery] = useState<string>(() => {
        return searchParams.get('q') || '';
    });

    const userOptions = users.map((user) => ({
        value: user.id,
        label: user.name || user.email || 'Utilisateur anonyme',
    }));

    // Helper function to update URL and cookies
    const updateFilters = useCallback(
        (filters: Partial<FilterState>) => {
            const currentFilters: FilterState = {
                tags: selectedTags,
                user: selectedUser,
                q: searchQuery,
                page: '1',
                ...filters,
            };

            // Save to cookie
            setCookie(null, 'recipeFilters', JSON.stringify(currentFilters), {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });

            // Build URL params
            const params = new URLSearchParams();
            if (currentFilters.tags.length > 0) {
                params.set('tags', currentFilters.tags.join(','));
            }
            if (currentFilters.user) {
                params.set('user', currentFilters.user);
            }
            if (currentFilters.q) {
                params.set('q', currentFilters.q);
            }
            if (currentFilters.page !== '1') {
                params.set('page', currentFilters.page);
            }

            // Navigate with new params
            const newUrl = params.toString() ? `/?${params.toString()}` : '/';
            router.push(newUrl);
        },
        [selectedTags, selectedUser, searchQuery, router]
    );

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            updateFilters({ q: value, page: '1' });
        }, 500),
        [updateFilters]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
        updateFilters({ tags: values, page: '1' });
    };

    const handleUserChange = (value: string) => {
        setSelectedUser(value);
        updateFilters({ user: value, page: '1' });
    };

    const resetFilters = () => {
        console.log('resetFilters');

        // Clear cookie
        destroyCookie(null, 'recipeFilters');

        // Reset state immediately
        setSelectedTags([]);
        setSelectedUser('');
        setSearchQuery('');

        // Navigate to clean URL
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
                        selectedUser={selectedUser}
                        tags={tags}
                        userOptions={userOptions}
                        onTagsChange={handleTagsChange}
                        onUserChange={handleUserChange}
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

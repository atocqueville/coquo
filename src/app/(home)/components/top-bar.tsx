'use client';

import { useState, useEffect } from 'react';
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

export default function TopBar({ tags }: { tags: Tag[] }) {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const tagOptions = tags.map((tag) => ({
        value: tag.id,
        variant: tag.name,
        label: badgeLabel[tag.name as keyof typeof badgeLabel],
    }));

    // Load saved filters from localStorage and sync with URL on initial render
    useEffect(() => {
        if (!initializing) return;

        try {
            // Get current URL params
            const url = new URL(window.location.href);
            const urlTagsParam = url.searchParams.get('tags');
            const urlTags = urlTagsParam ? urlTagsParam.split(',') : [];

            // Get localStorage filters
            const savedFilters = localStorage.getItem('recipeFilters');
            let localStorageTags: string[] = [];

            if (savedFilters) {
                const parsed = JSON.parse(savedFilters);
                localStorageTags = parsed.tags || [];
            }

            // Determine which tags to use (URL has priority)
            if (urlTags.length > 0) {
                // URL has tags, update localStorage and state
                setSelectedTags(urlTags);
                localStorage.setItem(
                    'recipeFilters',
                    JSON.stringify({ tags: urlTags })
                );
            } else if (localStorageTags.length > 0) {
                // No URL tags but we have localStorage tags, update URL and state
                setSelectedTags(localStorageTags);
                const params = new URLSearchParams();
                params.set('tags', localStorageTags.join(','));
                router.push(`?${params.toString()}`);
            }
        } catch (error) {
            console.error('Error syncing filters:', error);
        }

        setInitializing(false);
    }, [router, initializing]);

    const handleTagsChange = (values: string[]) => {
        setSelectedTags(values);
    };

    const saveFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Save to localStorage
        localStorage.setItem(
            'recipeFilters',
            JSON.stringify({
                tags: selectedTags,
            })
        );

        // Close the popover
        setIsPopoverOpen(false);

        const params = new URLSearchParams();

        if (selectedTags.length > 0) {
            params.set('tags', selectedTags.join(','));
        }
        router.push(`?${params.toString()}`);
    };

    const resetFilters = () => {
        // Save to localStorage
        localStorage.setItem(
            'recipeFilters',
            JSON.stringify({
                tags: [],
            })
        );

        // Reset state
        setSelectedTags([]);

        // Clear URL parameters and navigate
        router.push('/');

        // Close the popover
        setIsPopoverOpen(false);
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

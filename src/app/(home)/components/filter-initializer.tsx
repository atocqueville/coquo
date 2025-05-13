'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * FilterInitializer is a client component that handles
 * the initial routing based on localStorage filters.
 * It ensures filters are applied without visible re-renders in the main UI.
 */
export default function FilterInitializer() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Run only once when the component mounts
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        const initializeFilters = async () => {
            try {
                // Get current URL params
                const url = new URL(window.location.href);
                const urlTagsParam = url.searchParams.get('tags');

                // If URL already has tags, no need to redirect
                if (urlTagsParam) {
                    // Optionally sync localStorage with URL
                    const urlTags = urlTagsParam.split(',');
                    localStorage.setItem(
                        'recipeFilters',
                        JSON.stringify({ tags: urlTags })
                    );
                    setIsLoading(false);
                    return;
                }

                // Check localStorage for saved filters
                const savedFilters = localStorage.getItem('recipeFilters');
                if (!savedFilters) {
                    setIsLoading(false);
                    return;
                }

                const { tags: savedTags } = JSON.parse(savedFilters);
                if (
                    !savedTags ||
                    !Array.isArray(savedTags) ||
                    savedTags.length === 0
                ) {
                    setIsLoading(false);
                    return;
                }

                // Apply saved filters to URL
                const params = new URLSearchParams();
                params.set('tags', savedTags.join(','));

                // Use replace to avoid adding to history stack
                await router.replace(`?${params.toString()}`);

                // Always ensure loading state is cleared, even after redirect
                setIsLoading(false);

                // Also set a safety timeout in case the navigation doesn't trigger a full refresh
                // This ensures the loading indicator won't stay forever
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error initializing filters:', error);
                setIsLoading(false);
            }
        };

        initializeFilters();
    }, [router]);

    // Return a loading indicator if we're actively redirecting
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex justify-center items-center">
                <div className="animate-pulse flex flex-col space-y-4 max-w-3xl">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                    <div className="h-64 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded-md w-full"></div>
                </div>
            </div>
        );
    }

    // Nothing to render when not loading
    return null;
}

import type { Recipe } from '@prisma/client';

// Helper function to format time display
export const formatTime = (recipe: Pick<Recipe, 'prepTime' | 'cookTime'>) => {
    // Calculate total time (assuming prepTime exists, otherwise use default of 10 min)
    const prepTime = recipe.prepTime || 10;
    const cookTime = recipe.cookTime || 0;
    const totalTime = prepTime + cookTime;

    // Format minutes to hours and minutes if >= 60
    const formatMinutes = (minutes: number) => {
        if (minutes < 60) return `${minutes}mn`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) return `${hours}h`;
        return `${hours}h${(remainingMinutes < 10 ? '0' : '') + remainingMinutes}mn`;
    };

    return {
        prep: formatMinutes(prepTime),
        cook: formatMinutes(cookTime),
        total: formatMinutes(totalTime),
    };
};

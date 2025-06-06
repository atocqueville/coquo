interface DifficultyLabels {
    easy: string;
    medium: string;
    hard: string;
    unknown: string;
}

// Export the type for use in components
export type { DifficultyLabels };

// Helper function to create difficulty labels from translations
export const createDifficultyLabels = (
    t: (key: string) => string
): DifficultyLabels => ({
    easy: t('easy'),
    medium: t('medium'),
    hard: t('hard'),
    unknown: t('unknown'),
});

export const getDifficultyProps = (
    difficulty: number,
    labels: DifficultyLabels
) => {
    switch (difficulty) {
        case 1:
            return {
                color: 'bg-green-100 text-green-700 border border-green-200',
                label: labels.easy,
            };
        case 2:
            return {
                color: 'bg-amber-100 text-amber-700 border border-amber-200',
                label: labels.medium,
            };
        case 3:
            return {
                color: 'bg-red-100 text-red-700 border border-red-200',
                label: labels.hard,
            };
        default:
            return {
                color: 'bg-gray-100 text-gray-700 border border-gray-200',
                label: labels.unknown,
            };
    }
};

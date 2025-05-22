// Helper function to get difficulty badge props
export const getDifficultyProps = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return {
                color: 'bg-green-100 text-green-700 border border-green-200',
                label: 'Facile',
            };
        case 2:
            return {
                color: 'bg-amber-100 text-amber-700 border border-amber-200',
                label: 'Moyen',
            };
        case 3:
            return {
                color: 'bg-red-100 text-red-700 border border-red-200',
                label: 'Difficile',
            };
        default:
            return {
                color: 'bg-gray-100 text-gray-700 border border-gray-200',
                label: 'Inconnu',
            };
    }
};

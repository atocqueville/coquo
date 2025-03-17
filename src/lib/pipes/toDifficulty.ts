export function toDifficulty(diff: number) {
    switch (diff) {
        case 1:
            return 'Facile';
        case 2:
            return 'Moyen';
        case 3:
            return 'Difficile';
        default:
            return 'Inconnu';
    }
}

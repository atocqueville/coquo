export interface RecipeUi {
    id: number;
    title: string;
    picture: string | null;
    ingredients: string[];
    steps: Array<{
        id: number;
        title: string;
        instructions: string[];
    }>;
}

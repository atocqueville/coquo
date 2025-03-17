export interface RecipeUi {
    id: number;
    title: string;
    picture: string | null;
    ingredients: string[];
    description: string | null;
    difficulty: number;
    cookTime: number;
    prepTime: number;
    servings: number;
    steps: Array<{
        id: number;
        title: string;
        instructions: string[];
    }>;
}

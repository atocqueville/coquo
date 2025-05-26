export interface RecipeUi {
    id: number;
    title: string;
    picture: string | null;
    userId: string;
    ingredients: string[];
    difficulty: number;
    cookTime: number;
    prepTime: number;
    servings: number;
    tags: Array<{
        id: string;
        name: string;
    }>;
    steps: Array<{
        id: number;
        title: string;
        instructions: string[];
    }>;
}

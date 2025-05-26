export interface RecipeUi {
    id: number;
    title: string;
    images: Array<{
        id: number;
        path: string;
        order: number;
    }>;
    userId: string;
    author: {
        id: string;
        email: string | null;
        name: string | null;
    };
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

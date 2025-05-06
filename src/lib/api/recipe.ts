'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { CreateRecipeSchema } from '@/schemas';
import { auth } from '@/auth';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { z } from 'zod';

type CreateRecipeFormData = z.infer<typeof CreateRecipeSchema>;

export type RecipeWithTagsAndAuthor = Prisma.RecipeGetPayload<{
    include: { tags: true; author: { select: { email: true } } };
}>;

/**
 * Override to use filters
 */
export async function getRecipes(): Promise<RecipeWithTagsAndAuthor[]> {
    return prisma.recipe.findMany({
        include: {
            author: {
                select: { email: true },
            },
            tags: true,
        },
    });
}

export async function getRecipeById(id: string): Promise<RecipeUi> {
    const recipeDb = await prisma.recipe.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            steps: true,
            tags: true,
        },
    });
    if (!recipeDb) {
        throw new Error('Recipe not found');
    }

    const recipeUi = {
        ...recipeDb,
        ingredients: recipeDb.ingredients.split(';'),
        steps: recipeDb.steps.map((step) => {
            return {
                id: step.id,
                title: step.title,
                instructions: step.instructions.split(';'),
            };
        }),
        tags: recipeDb.tags.map((tag) => tag.name),
    };

    return recipeUi;
}

export async function createRecipe(formData: CreateRecipeFormData) {
    const session = await auth();
    const recipeFormToRecipeDb = mapCreateRecipeFormDataToRecipeDb(
        formData,
        session?.user?.id
    );
    await prisma.recipe.create({ data: recipeFormToRecipeDb });
    revalidatePath('/');
    redirect('/');
}

/**
 * Map array to string separated by ;
 */
const mapCreateRecipeFormDataToRecipeDb = (
    createRecipeFormData: CreateRecipeFormData,
    userId: string | undefined
): Prisma.RecipeCreateInput => {
    return {
        title: createRecipeFormData.title,
        picture: createRecipeFormData.picture,
        steps: {
            create: [
                {
                    title: 'Step 1',
                    instructions: 'Instructions',
                },
            ],
        },
        ingredients: 'Ingredients',
        author: {
            connect: {
                id: userId,
            },
        },
        tags: {
            connect: createRecipeFormData.tags.map((tag) => ({
                name: tag,
            })),
        },
        prepTime: 0,
        cookTime: 0,
        servings: 0,
        difficulty: 0,
        description: '',
    };
};

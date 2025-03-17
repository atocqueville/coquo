'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma, Recipe } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { CreateRecipeFormData } from '@/app/(home)/create/components/create-recipe-form';
import { auth } from '@/auth';
import type { RecipeUi } from '@/lib/model/recipe-ui';

/**
 * Override to use filters
 */
export async function getRecipes(): Promise<Recipe[]> {
    return prisma.recipe
        .findMany
        //     {
        //     include: {
        //         author: {
        //             select: { email: true },
        //         },
        //     },
        // }
        ();
}

export async function getRecipeById(id: string): Promise<RecipeUi> {
    const recipeDb = await prisma.recipe.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            steps: true,
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
    };

    return recipeUi;
}

export async function createRecipe(
    formData: CreateRecipeFormData,
    filePath: string
) {
    const session = await auth();
    const recipeFormToRecipeDb = mapCreateRecipeFormDataToRecipeDb(
        formData,
        filePath,
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
    filePath: string,
    userId: string | undefined
): Prisma.RecipeCreateInput => {
    return {
        title: createRecipeFormData.title,
        picture: filePath,
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
        prepTime: 0,
        cookTime: 0,
        servings: 0,
        difficulty: 0,
        description: '',
    };
};

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma, Recipe } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { CreateRecipeFormData } from '@/app/(home)/create/components/create-recipe-form';
import { auth } from '@/auth';

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
    };
};

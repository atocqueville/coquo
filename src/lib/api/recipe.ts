'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Recipe } from '@prisma/client';
import prisma from '@/lib/prisma';

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

export async function createRecipe() {
    // const rawFormData: Prisma.RecipeCreateInput = {
    //     title: formData.get('title') as string,
    //     content: formData.get('content') as string,
    // };
    // await prisma.recipe.create({ data: rawFormData });

    revalidatePath('/');
    redirect('/');
}

'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { CreateRecipeSchema } from '@/schemas';
import { auth } from '@/auth';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { z } from 'zod';
import { getUserStarredRecipeIds } from '@/lib/api/user';

type CreateRecipeFormData = z.infer<typeof CreateRecipeSchema>;

export type RecipeWithTagsAndAuthor = Prisma.RecipeGetPayload<{
    include: { tags: true; author: { select: { email: true } } };
}>;

export async function getRecipes(filters: {
    tags?: string;
    q?: string;
    user?: string;
    page?: string;
}): Promise<RecipeWithTagsAndAuthor[]> {
    const currentPage = parseInt(filters?.page || '1', 10);
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;

    return prisma.recipe.findMany({
        where: buildRecipeWhereInput(filters),
        include: {
            author: {
                select: { email: true },
            },
            tags: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: skip,
        take: pageSize,
    });
}

export async function getStarredRecipes(): Promise<RecipeWithTagsAndAuthor[]> {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const starredIds = await getUserStarredRecipeIds(session.user.id);
    if (!starredIds) throw new Error('Failed to load favorites');

    return prisma.recipe.findMany({
        where: {
            id: { in: starredIds },
        },
        include: {
            author: { select: { email: true } },
            tags: true,
        },
        orderBy: {
            createdAt: 'desc',
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
}

export async function updateRecipe(id: number, formData: CreateRecipeFormData) {
    const session = await auth();

    // Delete existing steps to replace them with new ones
    await prisma.recipeStep.deleteMany({
        where: {
            recipeId: id,
        },
    });

    // Map form data to DB structure
    const recipeData = {
        title: formData.title,
        picture: formData.picture,
        steps: {
            create: formData.steps.map((step) => ({
                title: step.title,
                instructions: step.instructions.join(';'),
            })),
        },
        ingredients: formData.ingredients.join(';'),
        tags: {
            set: [], // Clear existing tags
            connect: formData.tags.map((tag) => ({
                id: tag,
            })),
        },
        prepTime: formData.prepTime,
        cookTime: formData.cookTime,
        servings: formData.servings,
        difficulty: formData.difficulty,
    };

    // Update the recipe
    await prisma.recipe.update({
        where: { id },
        data: recipeData,
    });

    revalidatePath('/');
    revalidatePath(`/r/${id}`);
}

export async function toggleFavorite(recipeId: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const starredIds = await getUserStarredRecipeIds(session.user.id);
    if (!starredIds) throw new Error('Failed to load favorites');

    const alreadyStarred = starredIds.includes(Number(recipeId));
    const action = alreadyStarred ? 'disconnect' : 'connect';

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            starredRecipes: {
                [action]: { id: recipeId },
            },
        },
    });

    return { success: true };
}

export async function getRecipeCount(filters: {
    tags?: string;
    q?: string;
    user?: string;
}): Promise<number> {
    return prisma.recipe.count({
        where: buildRecipeWhereInput(filters),
    });
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
            create: createRecipeFormData.steps.map((step) => ({
                title: step.title,
                instructions: step.instructions.join(';'),
            })),
        },
        ingredients: createRecipeFormData.ingredients.join(';'),
        author: {
            connect: {
                id: userId,
            },
        },
        tags: {
            connect: createRecipeFormData.tags.map((tag) => ({
                id: tag,
            })),
        },
        prepTime: createRecipeFormData.prepTime,
        cookTime: createRecipeFormData.cookTime,
        servings: createRecipeFormData.servings,
        difficulty: createRecipeFormData.difficulty,
    };
};

const buildRecipeWhereInput = (filters: {
    tags?: string;
    q?: string;
    user?: string;
}): Prisma.RecipeWhereInput => {
    const whereConditions: Prisma.RecipeWhereInput = {};

    if (filters.tags && filters.tags.length > 0) {
        whereConditions.AND = filters.tags.split(',').map((tagId) => ({
            tags: {
                some: {
                    id: tagId,
                },
            },
        }));
    }

    if (filters.q) {
        whereConditions.title = {
            contains: filters.q,
        };
    }

    if (filters.user) {
        whereConditions.author = {
            id: filters.user,
        };
    }

    return whereConditions;
};

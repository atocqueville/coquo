'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { CreateRecipeSchema } from '@/schemas';
import { auth } from '@/auth';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { z } from 'zod';
import { getUserStarredRecipeIds } from '@/data/user';

type CreateRecipeFormData = z.infer<typeof CreateRecipeSchema>;

export type RecipeWithTagsAndAuthor = Prisma.RecipeGetPayload<{
    include: { tags: true; author: { select: { email: true } } };
}>;

export async function getRecipes(filters: {
    tags?: string;
    q?: string;
    page?: string;
}): Promise<RecipeWithTagsAndAuthor[]> {
    const tagIds = filters?.tags ? filters.tags.split(',') : [];
    const searchQuery = filters?.q || '';
    const currentPage = parseInt(filters?.page || '1', 10);
    const pageSize = 10;
    const skip = (currentPage - 1) * pageSize;

    // Build where conditions
    const whereConditions: Prisma.RecipeWhereInput = {};

    // Add tag filtering
    if (tagIds.length > 0) {
        whereConditions.AND = tagIds.map((tagId) => ({
            tags: {
                some: {
                    id: tagId,
                },
            },
        }));
    }

    // Add search filtering
    if (searchQuery) {
        whereConditions.title = {
            contains: searchQuery,
        };
    }

    return prisma.recipe.findMany({
        where: whereConditions,
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
}): Promise<number> {
    const tagIds = filters?.tags ? filters.tags.split(',') : [];
    const searchQuery = filters?.q || '';

    // Build where conditions
    const whereConditions: Prisma.RecipeWhereInput = {};

    // Add tag filtering
    if (tagIds.length > 0) {
        whereConditions.tags = {
            some: {
                id: { in: tagIds },
            },
        };
    }

    // Add search filtering
    if (searchQuery) {
        whereConditions.title = {
            contains: searchQuery,
        };
    }

    return prisma.recipe.count({
        where: whereConditions,
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
        difficulty: 0,
    };
};

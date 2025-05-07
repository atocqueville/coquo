import prisma from '@/lib/prisma';

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    } catch {
        return null;
    }
};

export const getUserStarredRecipeIds = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { starredRecipes: true },
        });
        return user?.starredRecipes.map((recipe) => recipe.id);
    } catch {
        return null;
    }
};

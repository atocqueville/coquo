'use server';

import type { Prisma } from '@/lib/prisma';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { headers } from 'next/headers';

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

export async function getAdminEmail() {
    const user = await prisma.user.findFirst({
        where: { role: 'admin' },
    });

    if (!user) {
        throw new Error('No Admin found');
    }

    return user.email;
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
        where: { id },
        data,
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user.email;
}

export async function getAllRecipeAuthors() {
    return prisma.user.findMany({
        where: {
            recipes: {
                some: {},
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}

export async function getPendingUsers() {
    return prisma.user.findMany({
        where: { approved: false },
    });
}

export async function getBannedUsers() {
    return prisma.user.findMany({
        where: { banned: true },
    });
}

export async function approveUser(userId: string): Promise<void> {
    await auth.api.adminUpdateUser({
        body: {
            userId,
            data: { approved: true },
        },
        headers: await headers(),
    });
}

export async function banUser(userId: string): Promise<void> {
    await auth.api.banUser({
        body: {
            userId,
            banReason: 'Banned by admin',
        },
        headers: await headers(),
    });
}

export async function unbanUser(userId: string): Promise<void> {
    await auth.api.unbanUser({
        body: { userId },
        headers: await headers(),
    });
}

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

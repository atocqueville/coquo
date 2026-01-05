'use server';

import type { Prisma } from '@prisma/client';
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
    const query = await auth.api.listUsers({
        query: {
            filterField: 'approved',
            filterValue: 'false',
            filterOperator: 'eq',
        },
        headers: await headers(),
    });
    return query.users;
}

export async function getBlockedUsers() {
    const query = await auth.api.listUsers({
        query: {
            filterField: 'isBlocked',
            filterValue: 'true',
            filterOperator: 'eq',
        },
        headers: await headers(),
    });
    return query.users;
}

export async function approveUser(id: string): Promise<void> {
    await auth.api.adminUpdateUser({
        body: {
            userId: id,
            data: { approved: true },
        },
        headers: await headers(),
    });
}

// TODO Use banUser instead
export async function blockUser(id: string): Promise<void> {
    await auth.api.adminUpdateUser({
        body: {
            userId: id,
            data: { isBlocked: true },
        },
        headers: await headers(),
    });
}

// TODO Use unbanUser instead
export async function unblockUser(id: string): Promise<void> {
    await auth.api.adminUpdateUser({
        body: {
            userId: id,
            data: { isBlocked: false },
        },
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

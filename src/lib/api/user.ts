'use server';

import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { userAuthSchema } from '@/schemas';
import { z } from 'zod';
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

export async function getAllUsers() {
    return prisma.user.findMany();
}

// TODO: USE ADMIN API
export async function getUnverifiedUsers() {
    const users = await prisma.user.findMany({
        where: { emailVerified: null },
    });
    return users;
}

// TODO: USE ADMIN API
export async function verifyUser(id: string) {
    await prisma.user.update({
        where: { id },
        data: { emailVerified: new Date() },
    });
}

// TODO: USE ADMIN API
export async function getBlockedUsers() {
    const users = await prisma.user.findMany({
        where: { isBlocked: true },
    });
    return users;
}

// TODO: USE ADMIN API
export async function blockUser(id: string) {
    await prisma.user.update({
        where: { id },
        data: { isBlocked: true },
    });
}

// TODO: USE ADMIN API
export async function unblockUser(id: string) {
    await prisma.user.update({
        where: { id },
        data: { isBlocked: false },
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

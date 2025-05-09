'use server';

import type { Prisma, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { compare, genSalt, hash } from 'bcryptjs';
import { userAuthSchema } from '@/schemas';
import { z } from 'zod';
import { getUserByEmail } from '@/data/user';

const SALT_ROUNDS = 6;

const hashPassword = async (password: string) => {
    const salt = await genSalt(SALT_ROUNDS);
    return await hash(password, salt);
};

export async function createUser(
    registerFormData: z.infer<typeof userAuthSchema>
): Promise<User> {
    const existingUser = await getUserByEmail(registerFormData.email);

    if (existingUser) {
        throw new Error('User already exists');
    }

    const usersCount = await prisma.user.count();

    const hashedPassword = await hashPassword(registerFormData.password);

    const isFirstUser = usersCount === 0;

    const formData: Prisma.UserCreateInput = {
        email: registerFormData.email,
        password: hashedPassword,
        name: registerFormData.name,
        role: isFirstUser ? 'ADMIN' : 'USER',
        emailVerified: isFirstUser ? new Date() : null,
    };

    return await prisma.user.create({ data: formData });
}

export async function getAdminEmail() {
    const user = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
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
        throw new Error('No Admin found');
    }

    return user.email;
}

export async function updatePassword(
    id: string,
    {
        currentPassword,
        newPassword,
    }: {
        currentPassword: string;
        newPassword: string;
    }
) {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    const isPasswordCorrect = await compare(
        currentPassword,
        user?.password || ''
    );

    if (!isPasswordCorrect) {
        throw new Error('Le mot de passe actuel est incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
    return await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
    });
}

export async function getUnverifiedUsers() {
    const users = await prisma.user.findMany({
        where: { emailVerified: null },
    });
    return users;
}

export async function verifyUser(id: string) {
    await prisma.user.update({
        where: { id },
        data: { emailVerified: new Date() },
    });
}

export async function getBlockedUsers() {
    const users = await prisma.user.findMany({
        where: { isBlocked: true },
    });
    return users;
}

export async function blockUser(id: string) {
    await prisma.user.update({
        where: { id },
        data: { isBlocked: true },
    });
}

export async function unblockUser(id: string) {
    await prisma.user.update({
        where: { id },
        data: { isBlocked: false },
    });
}

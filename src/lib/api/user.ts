'use server';

import type { Prisma, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { genSalt, hash } from 'bcryptjs';
import { userAuthSchema } from '@/schemas';
import { z } from 'zod';
import { getUserByEmail } from '@/data/user';

const SALT_ROUNDS = 6;

export async function createUser(
    registerFormData: z.infer<typeof userAuthSchema>
): Promise<User> {
    const existingUser = await getUserByEmail(registerFormData.email);

    if (existingUser) {
        throw new Error('User already exists');
    }

    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(registerFormData.password, salt);
    const formData: Prisma.UserCreateInput = {
        email: registerFormData.email,
        password: hashedPassword,
        name: registerFormData.name,
    };

    return await prisma.user.create({ data: formData });
}

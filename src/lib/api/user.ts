'use server';

import { redirect } from 'next/navigation';

import type { Prisma, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { RegisterFormData } from '@/app/api/auth/(custom-auth)/register/register-form';
import { compare, genSalt, hash } from 'bcryptjs';

const SALT_ROUNDS = 6;

export async function createUser(
    registerFormData: RegisterFormData
): Promise<User> {
    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(registerFormData.password, salt);

    const formData: Prisma.UserCreateInput = {
        email: registerFormData.email,
        password: hashedPassword,
        name: registerFormData.name,
    };
    await prisma.user.create({ data: formData });
    redirect('/');
}

export async function getUser({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) return null;
    const passwordsMatch = await compare(password, user.password || '');
    if (passwordsMatch) return user;
    return null;
}

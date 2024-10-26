'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function createPost(formData: FormData) {
    const rawFormData: Prisma.PostCreateInput = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
    };
    // Test it out:
    console.log(rawFormData);
    await prisma.post.create({ data: rawFormData });

    revalidatePath('/posts');
    redirect('/posts');
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('google', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error);
            console.log('type', error.type);
            switch (error.type) {
                case 'OAuthSignInError':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

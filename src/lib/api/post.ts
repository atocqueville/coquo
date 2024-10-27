'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma, Post } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function getPosts(): Promise<Post[]> {
    return prisma.post.findMany({
        include: {
            author: {
                select: { email: true },
            },
        },
    });
}

export async function createPost(formData: FormData) {
    const rawFormData: Prisma.PostCreateInput = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
    };
    await prisma.post.create({ data: rawFormData });

    revalidatePath('/posts');
    redirect('/posts');
}

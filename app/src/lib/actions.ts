'use server';

import prisma from '@/lib/prisma';
import type { Prisma } from "@prisma/client";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const rawFormData: Prisma.PostCreateInput = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
      };
      // Test it out:
      console.log(rawFormData);
      await prisma.post.create({data: rawFormData})

      revalidatePath('/posts');
      redirect('/posts');
}
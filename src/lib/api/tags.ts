'use server';

import prisma from '@/lib/prisma';
import type { Tag } from '@prisma/client';

export async function getTags() {
    const tags = await prisma.tag.findMany({});
    if (!tags) {
        return [];
    }

    return tags;
}

export async function createTag(tag: Tag) {
    const newTag = await prisma.tag.create({
        data: tag,
    });
    return newTag;
}

export async function deleteTag(id: string) {
    const deletedTag = await prisma.tag.delete({
        where: { id },
    });
    return deletedTag;
}

'use server';

import prisma from '@/lib/prisma';

export async function getTags() {
    const tags = await prisma.tag.findMany({});
    if (!tags) {
        return [];
    }

    return tags;
}

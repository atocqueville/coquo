import prisma from '@/lib/prisma';

export async function getTags() {
    const tags = await prisma.tag.findMany({});
    if (!tags) {
        throw new Error('No tags found');
    }

    return tags.map((tag) => tag.name);
}

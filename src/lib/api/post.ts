import prisma from '@/lib/prisma'
import type { Post } from '@prisma/client'

export async function getPosts(): Promise<Post[]> {
    return prisma.post.findMany({
        // where: { published: true },
        include: {
            author: {
                select: { email: true },
            },
        },
    })
}

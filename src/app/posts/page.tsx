import prisma from '@/lib/prisma'
import type { Post } from '@prisma/client'
import ButtonLink from '@/components/button-link'

async function getData(): Promise<Post[]> {
    return await prisma.post.findMany({
        //   where: { published: true },
        include: {
            author: {
                select: { email: true },
            },
        },
    })
}

export default async function Page() {
    const posts = await getData()

    return (
        <>
            <h2>Welcome to Posts page</h2>
            <ButtonLink path="/">Go back to home page !</ButtonLink>

            <ButtonLink path="/create">Create a new post !</ButtonLink>

            {posts.map((post) => (
                <p key={post.id}>
                    <div>
                        <p>
                            Make beautiful websites regardless of your design
                            experience.
                        </p>
                        <p>{post.title}</p>
                        <p>{post.content}</p>
                    </div>
                </p>
            ))}
        </>
    )
}

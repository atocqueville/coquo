import ButtonLink from '@/components/button-link';
import prisma from '../../../lib/prisma';
import type { GetStaticProps } from 'next/types';
import type { Post } from '@prisma/client';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";

 async function getData() {
    return await prisma.post.findMany({
    //   where: { published: true },
      include: {
        author: {
          select: { email : true },
        },
      },
    });
  };

export default async function Page() {

    const posts = await getData();

    console.log('data', posts)
  return (
    <>
        <h2>Welcome to Posts page</h2>
        <ButtonLink path=''>Go back to home page !</ButtonLink>

        {posts.map(post=>(
        <Card key={post.id}>
            <CardBody>
            <p>Make beautiful websites regardless of your design experience.</p>
            <p>{post.title}</p>
            <p>{post.content}</p>
            </CardBody>
        </Card>
        ))}
        

    </>
  )
}
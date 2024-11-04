import Image from 'next/image';
import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Recipe } from '@prisma/client';

export default async function RecipeItem({ recipe }: { recipe: Recipe }) {
    return (
        <Link href={`/r/${recipe.id}`}>
            <AspectRatio
                ratio={1}
                className="bg-muted overflow-hidden rounded-md"
            >
                <Image
                    src={`/api/image-proxy?imageId=${recipe.picture}`}
                    alt="recipe top view"
                    fill
                    className="h-full w-full rounded-md object-cover transition-transform duration-300 hover:scale-[1.15]"
                />
            </AspectRatio>
            <h3 className="mt-4 scroll-m-20 text-center text-2xl font-normal tracking-tight hover:underline">
                {recipe.title}
            </h3>
        </Link>
    );
}

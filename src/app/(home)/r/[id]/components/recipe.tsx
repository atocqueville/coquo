import Image from 'next/image';
// import Link from 'next/link';
import type { Recipe } from '@prisma/client';
import type { RecipeUi } from '@/lib/model/recipe-ui';

export default async function Recipe({ recipe }: { recipe: RecipeUi }) {
    return (
        <div className="h-full">
            <div className="relative h-3/6">
                <Image
                    src={`/api/image-proxy?imageId=${recipe.picture}`}
                    fill
                    alt="recipe top view"
                    className="object-cover"
                />
            </div>

            <h3 className="mt-4 scroll-m-20 text-center text-2xl font-normal tracking-tight hover:underline">
                {recipe.title}
            </h3>
        </div>
    );
}

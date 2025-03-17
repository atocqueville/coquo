import Image from 'next/image';
import Link from 'next/link';
import type { Recipe } from '@prisma/client';
import { toDifficulty } from '@/lib/pipes/toDifficulty';

export default async function RecipeItem({ recipe }: { recipe: Recipe }) {
    return (
        <Link
            key={recipe.id}
            href={`/r/${recipe.id}`}
            className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={`/api/image-proxy?imageId=${recipe.picture}`}
                    alt="recipe top view"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                    <div className="flex justify-between text-white">
                        <span className="text-sm font-medium">
                            {recipe.cookTime}mn
                        </span>
                        <span className="text-sm font-medium">
                            {toDifficulty(recipe.difficulty)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-medium line-clamp-2">{recipe.title}</h3>
            </div>
        </Link>
    );
}

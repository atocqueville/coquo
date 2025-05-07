import Image from 'next/image';
import Link from 'next/link';
import { toDifficulty } from '@/lib/pipes/toDifficulty';
import { Badge } from '@/components/ui/badge';
import type { RecipeWithTagsAndAuthor } from '@/lib/api/recipe';
import { currentUser } from '@/lib/auth';
import { getUserStarredRecipeIds } from '@/data/user';
import FavoriteButton from './favorite-button';

export default async function RecipeItem({
    recipe,
}: {
    recipe: RecipeWithTagsAndAuthor;
}) {
    const user = await currentUser();
    const starredRecipeIds = await getUserStarredRecipeIds(user?.id as string);

    return (
        <>
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
                    <FavoriteButton
                        recipeId={recipe.id}
                        userStarredIds={starredRecipeIds ?? []}
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
                    <h3 className="font-medium line-clamp-2 mb-2">
                        {recipe.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {recipe.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={tag.name as never}
                                size="sm"
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </Link>
        </>
    );
}

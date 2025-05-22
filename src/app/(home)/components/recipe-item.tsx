import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { RecipeWithTagsAndAuthor } from '@/lib/api/recipe';
import { currentUser } from '@/lib/auth';
import { getUserStarredRecipeIds } from '@/lib/api/user';
import FavoriteButton from './favorite-button';
import { getDifficultyProps } from '@/utils/difficulty';
import { formatTime } from '@/utils/time-format';

export default async function RecipeItem({
    recipe,
}: {
    recipe: RecipeWithTagsAndAuthor;
}) {
    const user = await currentUser();
    const starredRecipeIds = await getUserStarredRecipeIds(user?.id as string);
    const timeInfo = formatTime(recipe);

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
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                    <FavoriteButton
                        recipeId={recipe.id}
                        userStarredIds={starredRecipeIds ?? []}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                        <div className="flex justify-between text-white">
                            <span className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 text-xs font-medium">
                                <Clock className="h-3 w-3" />
                                <span>{timeInfo.total}</span>
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyProps(recipe.difficulty).color}`}
                            >
                                {getDifficultyProps(recipe.difficulty).label}
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
                            <Badge key={tag.id} tag={tag} size="sm" />
                        ))}
                    </div>
                </div>
            </Link>
        </>
    );
}

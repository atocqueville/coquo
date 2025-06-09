import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat } from 'lucide-react';
import type { RecipeWithTagsAndAuthor } from '@/lib/api/recipe';
import { currentUser } from '@/lib/auth';
import { getUserStarredRecipeIds } from '@/lib/api/user';
import FavoriteButton from './favorite-button';
import { getDifficultyProps, createDifficultyLabels } from '@/utils/difficulty';
import { formatTime } from '@/utils/time-format';
import { getTranslations } from 'next-intl/server';

export default async function RecipeItem({
    recipe,
}: {
    recipe: RecipeWithTagsAndAuthor;
}) {
    const user = await currentUser();
    const starredRecipeIds = await getUserStarredRecipeIds(user?.id as string);
    const timeInfo = formatTime(recipe);
    const difficultyT = await getTranslations('common.Difficulty');
    const difficultyLabels = createDifficultyLabels(difficultyT);

    return (
        <>
            <Link
                key={recipe.id}
                href={`/r/${recipe.id}`}
                className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md flex sm:flex-col"
            >
                <div className="relative w-[140px] h-[120px] sm:h-auto sm:w-full sm:aspect-[4/3] overflow-hidden flex-shrink-0">
                    {recipe.images && recipe.images.length > 0 ? (
                        <>
                            <Image
                                src={`/api/image-proxy?imageId=${recipe.images[0].path}`}
                                alt="recipe top view"
                                fill
                                sizes="(max-width: 640px) 128px, 25vw"
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-8 sm:p-4 sm:pt-12">
                                <div className="flex justify-between text-white">
                                    <span className="flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 px-1.5 py-0.5 text-xs font-medium sm:px-2">
                                        <Clock className="h-3 w-3" />
                                        <span>{timeInfo.total}</span>
                                    </span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-xs font-medium sm:px-2 ${getDifficultyProps(recipe.difficulty, difficultyLabels).color}`}
                                    >
                                        {
                                            getDifficultyProps(
                                                recipe.difficulty,
                                                difficultyLabels
                                            ).label
                                        }
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 relative">
                                <div className="text-center">
                                    <ChefHat className="h-8 w-8 sm:h-12 sm:w-12 text-orange-400 mx-auto mb-1 sm:mb-2" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1 rounded-full bg-white text-gray-700 border border-gray-200 px-1.5 py-0.5 text-xs font-medium sm:px-2 shadow-sm">
                                        <Clock className="h-3 w-3" />
                                        <span>{timeInfo.total}</span>
                                    </span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-xs font-medium sm:px-2 shadow-sm ${getDifficultyProps(recipe.difficulty, difficultyLabels).color}`}
                                    >
                                        {
                                            getDifficultyProps(
                                                recipe.difficulty,
                                                difficultyLabels
                                            ).label
                                        }
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                    <FavoriteButton
                        recipeId={recipe.id}
                        userStarredIds={starredRecipeIds ?? []}
                    />
                </div>
                <div className="p-3 sm:p-4 flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-2 mb-2 text-sm sm:text-base">
                        {recipe.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {recipe.tags.map((tag) => (
                            <Badge key={tag.id} tag={tag} size="sm" />
                        ))}
                    </div>
                </div>
            </Link>
        </>
    );
}

import { Carrot, ChefHat, CookingPot, Pencil, Users } from 'lucide-react';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { CrossableCheckbox } from '@/components/ui/crossable-checkbox';
import { CrossableStep } from '@/components/ui/crossable-step';
import Link from 'next/link';
import DynamicWakeLockWrapper from './dynamic-wake-lock-wrapper';
import RecipeDeleteButton from './recipe-delete-button';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { cn } from '@/lib/utils';
import { getDifficultyProps, createDifficultyLabels } from '@/utils/difficulty';
import { formatTime } from '@/utils/time-format';
import RecipeImageCarousel from './recipe-image-carousel';
import { PageMobileFooter } from '@/components/page-wrapper';
import BackButton from './back-button';

const IngredientsList = ({
    ingredients,
    className,
}: {
    ingredients: string[];
    className?: string;
}) => {
    return (
        <ul className={cn('space-y-4', className)}>
            {ingredients.map((ingredient, index) => (
                <CrossableCheckbox id={ingredient} key={index}>
                    {ingredient}
                </CrossableCheckbox>
            ))}
        </ul>
    );
};

export default async function Recipe({ recipe }: { recipe: RecipeUi }) {
    const session = await auth();
    const t = await getTranslations('RecipePage');
    const difficultyT = await getTranslations('Difficulty');
    const isAuthor = session?.user?.id === recipe.userId;
    const timeInfo = formatTime(recipe);

    const difficultyLabels = createDifficultyLabels(difficultyT);

    return (
        <div className="flex flex-col">
            <main className="flex-1 overflow-hidden">
                <div className="flex flex-col md:flex-row h-screen">
                    {/* Recipe content */}
                    <div className="flex-1 overflow-y-auto" id="recipe-content">
                        {/* Recipe hero image(s) */}
                        <div className="relative h-[300px] sm:h-[400px]">
                            {recipe.images && recipe.images.length > 0 ? (
                                <RecipeImageCarousel images={recipe.images} />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 relative">
                                    <div className="text-center">
                                        <ChefHat className="h-16 w-16 text-orange-400 mx-auto" />
                                    </div>
                                </div>
                            )}

                            {/* Back button - fixed position for better visibility */}
                            <BackButton />

                            {isAuthor && (
                                <div className="absolute top-4 left-16 z-20 flex gap-3">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                        asChild
                                    >
                                        <Link href={`/r/${recipe.id}/edit`}>
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">
                                                {t('actions.editRecipe')}
                                            </span>
                                        </Link>
                                    </Button>
                                    <RecipeDeleteButton
                                        recipeId={recipe.id.toString()}
                                    />
                                </div>
                            )}

                            <div className="absolute top-4 right-4 z-20">
                                <DynamicWakeLockWrapper />
                            </div>

                            {/* Cooking info and tags overlaying the image */}
                            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                                {/* Cooking time */}
                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                                    <div className="flex items-center gap-1 rounded-full bg-white text-gray-700 border border-gray-200 px-3 py-1 text-sm font-medium shadow-sm">
                                        <ChefHat className="mr-1 h-4 w-4" />
                                        <span>{timeInfo.prep}</span>
                                        <span className="text-muted-foreground ml-1 hidden sm:inline">
                                            {t('timeLabels.preparation')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 rounded-full bg-white text-gray-700 border border-gray-200 px-3 py-1 text-sm font-medium shadow-sm">
                                        <CookingPot className="mr-1 h-4 w-4" />
                                        <span>{timeInfo.cook}</span>
                                        <span className="text-muted-foreground ml-1 hidden sm:inline">
                                            {t('timeLabels.cooking')}
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium shadow-sm ${getDifficultyProps(recipe.difficulty, difficultyLabels).color}`}
                                    >
                                        <span>
                                            {
                                                getDifficultyProps(
                                                    recipe.difficulty,
                                                    difficultyLabels
                                                ).label
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 rounded-full bg-white text-gray-700 border border-gray-200 px-3 py-1 text-sm font-medium shadow-sm">
                                        <Users className="mr-1 h-4 w-4" />
                                        <span>{recipe.servings}</span>
                                        <span className="text-muted-foreground ml-1 hidden sm:inline">
                                            {t('timeLabels.people')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remove the old tags section since they're now in the overlay */}
                        <div className="bg-white pt-3">
                            {/* Intentionally empty - spacing between image and title */}
                        </div>

                        {/* Author */}
                        <div className="px-6">
                            {recipe.author.email && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t('author')} {recipe.author.name}
                                </p>
                            )}
                        </div>

                        {/* Sticky title and ingredients button */}
                        <div className="sticky w-screen md:w-auto top-0 bg-white z-10 border-b">
                            <div className="flex items-center justify-between px-6 py-3">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl sm:text-2xl font-bold truncate md:whitespace-normal">
                                        {recipe.title}
                                    </h1>
                                </div>

                                {/* Ingredients sheet trigger for mobile */}
                                <div className="md:hidden">
                                    <Drawer>
                                        <DrawerTrigger asChild>
                                            <Button
                                                size="sm"
                                                className="flex items-center gap-2 whitespace-nowrap ml-2"
                                                variant="outline"
                                            >
                                                <Carrot className="h-4 w-4" />
                                                <span className="xs:hidden">
                                                    {t('sections.ingredients')}
                                                </span>
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerPortal>
                                            <DrawerOverlay className="fixed inset-0 bg-black/40" />
                                            <DrawerContent className="flex flex-col rounded-t-[10px] mt-24 h-[80%] lg:h-[320px] fixed bottom-0 left-0 right-0 outline-none">
                                                <VisuallyHidden>
                                                    <DrawerTitle>
                                                        {t(
                                                            'sections.ingredients'
                                                        )}
                                                    </DrawerTitle>
                                                </VisuallyHidden>
                                                <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto">
                                                    <div className="max-w-md mx-auto space-y-4">
                                                        <IngredientsList
                                                            className="mx-4"
                                                            ingredients={
                                                                recipe.ingredients
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </DrawerContent>
                                        </DrawerPortal>
                                    </Drawer>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pb-12">
                            <h2 className="text-2xl font-semibold">
                                {t('sections.instructions')}
                            </h2>
                            <div className="mt-4 space-y-8">
                                {recipe.steps.map((step) => (
                                    <CrossableStep
                                        key={step.id}
                                        id={step.id.toString()}
                                        title={step.title}
                                        instructions={step.instructions}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sticky ingredients panel - desktop only */}
                    <div
                        className="hidden md:block md:w-80 md:border-l h-screen overflow-y-auto"
                        id="ingredients-panel"
                    >
                        <div className="h-full">
                            <div className="flex flex-col h-full">
                                <div className="sticky top-0 bg-white z-10">
                                    <h1 className="pt-6 pb-4 px-6 text-2xl font-bold">
                                        {t('sections.ingredients')}
                                    </h1>
                                    <Separator className="" />
                                </div>
                                <div className="p-6 flex-1 overflow-y-auto">
                                    <ScrollArea>
                                        <IngredientsList
                                            ingredients={recipe.ingredients}
                                        />
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <PageMobileFooter />
                </div>
            </main>
        </div>
    );
}

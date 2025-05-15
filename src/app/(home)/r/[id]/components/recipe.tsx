import Image from 'next/image';
import { Carrot, ChefHat, ChevronLeft, CookingPot, Users } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { CrossableCheckbox } from '@/components/ui/crossable-checkbox';
import { CrossableStep } from '@/components/ui/crossable-step';
import Link from 'next/link';
import DynamicWakeLockWrapper from './dynamic-wake-lock-wrapper';

const IngredientsList = ({ ingredients }: { ingredients: string[] }) => {
    return (
        <>
            <h1 className="pt-6 pb-4 px-6 text-2xl font-bold">Ingrédients</h1>
            <Separator className="" />
            <div className="p-6">
                <ScrollArea>
                    <ul className="space-y-4">
                        {ingredients.map((ingredient, index) => (
                            <CrossableCheckbox id={ingredient} key={index}>
                                {ingredient}
                            </CrossableCheckbox>
                        ))}
                    </ul>
                </ScrollArea>
            </div>
        </>
    );
};

export default async function Recipe({ recipe }: { recipe: RecipeUi }) {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <div className="flex flex-col md:flex-row">
                    {/* Recipe content */}
                    <div className="flex-1">
                        {/* Recipe hero image */}
                        <div className="relative h-[300px] sm:h-[400px]">
                            <Image
                                src={`/api/image-proxy?imageId=${recipe.picture}`}
                                alt={`recipe top view`}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Back button - fixed position for better visibility */}
                            <div className="absolute top-4 left-4 z-10">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="py-2 px-3 shadow-lg hover:shadow-md transition-all"
                                >
                                    <Link href="/">
                                        <ChevronLeft className="mr-1" />
                                        <span className="hidden sm:inline">
                                            Retour aux recettes
                                        </span>
                                        <span className="sm:hidden">
                                            Retour
                                        </span>
                                    </Link>
                                </Button>
                            </div>

                            {/* Wake Lock Switch - positioned in top right corner */}
                            <div className="absolute top-4 right-4 z-10">
                                <DynamicWakeLockWrapper />
                            </div>

                            {/* Cooking info and tags overlaying the image */}
                            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                                {/* Cooking time */}
                                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                                    <div className="flex items-center h-9 px-3 bg-background rounded-lg shadow-md border text-sm">
                                        <ChefHat className="mr-2 h-4 w-4 text-primary" />
                                        <span className="font-medium">
                                            {recipe.prepTime}mn
                                        </span>
                                        <span className="text-muted-foreground ml-1 hidden sm:inline">
                                            préparation
                                        </span>
                                    </div>

                                    <div className="flex items-center h-9 px-3 bg-background rounded-lg shadow-md border text-sm">
                                        <CookingPot className="mr-2 h-4 w-4 text-primary" />
                                        <span className="font-medium">
                                            {recipe.cookTime}mn
                                        </span>
                                        <span className="text-muted-foreground ml-1 hidden sm:inline">
                                            cuisson
                                        </span>
                                    </div>

                                    <div className="flex items-center h-9 px-3 bg-background rounded-lg shadow-md border text-sm">
                                        <Users className="mr-2 h-4 w-4 text-primary" />
                                        <span className="font-medium">
                                            {recipe.servings}
                                        </span>
                                        <span className="text-muted-foreground ml-1 hidden sm:inline">
                                            personnes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remove the old tags section since they're now in the overlay */}
                        <div className="bg-white pt-3">
                            {/* Intentionally empty - spacing between image and title */}
                        </div>

                        {/* Sticky title and ingredients button */}
                        <div className="sticky top-0 bg-white z-10 border-b">
                            <div className="flex items-center justify-between px-6 py-3">
                                <h1 className="text-xl sm:text-2xl font-bold truncate md:whitespace-normal">
                                    {recipe.title}
                                </h1>

                                {/* Ingredients sheet trigger for mobile */}
                                <div className="md:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button
                                                size="sm"
                                                className="flex items-center gap-2 whitespace-nowrap ml-2"
                                            >
                                                <Carrot className="h-4 w-4" />
                                                <span className="hidden xs:inline">
                                                    Voir les ingrédients
                                                </span>
                                                <span className="xs:hidden">
                                                    Ingrédients
                                                </span>
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent
                                            side="bottom"
                                            className="p-0"
                                        >
                                            <SheetHeader className="text-left">
                                                <VisuallyHidden asChild>
                                                    <SheetTitle>
                                                        Ingrédients
                                                    </SheetTitle>
                                                </VisuallyHidden>
                                            </SheetHeader>
                                            <IngredientsList
                                                ingredients={recipe.ingredients}
                                            />
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pb-12">
                            <h2 className="text-2xl font-semibold">
                                Instructions
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
                    <div className="hidden md:block md:w-80 md:border-l">
                        <div className="sticky top-0">
                            <IngredientsList ingredients={recipe.ingredients} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

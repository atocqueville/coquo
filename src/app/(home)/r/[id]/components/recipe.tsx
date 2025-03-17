import Image from 'next/image';
import { Clock, List, Users } from 'lucide-react';

import type { RecipeUi } from '@/lib/model/recipe-ui';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { CrossableCheckbox } from '@/components/ui/crossable-checkbox';

export default async function Recipe({ recipe }: { recipe: RecipeUi }) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                <main className="flex-1">
                    {/* Recipe hero image */}
                    <div className="relative h-[300px] sm:h-[400px]">
                        <Image
                            src={`/api/image-proxy?imageId=${recipe.picture}`}
                            alt={`recipe top view`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Recipe content */}
                        <div className="flex-1 p-6">
                            <h1 className="text-3xl font-bold">
                                {recipe.title}
                            </h1>

                            <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Préparation: {recipe.prepTime}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Cuisson: {recipe.cookTime}</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="mr-1 h-4 w-4" />
                                    <span>{recipe.servings} personnes</span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <p className="text-lg">{recipe.description}</p>

                            <h2 className="mt-8 text-2xl font-semibold">
                                Instructions
                            </h2>
                            <div className="mt-4 space-y-8">
                                {recipe.steps.map((step) => (
                                    <div key={step.id} className="space-y-4">
                                        <h3 className="text-xl font-medium">
                                            {step.title}
                                        </h3>
                                        <ol className="space-y-4 pl-5">
                                            {step.instructions.map(
                                                (instruction, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="pl-2"
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                                {idx + 1}
                                                            </div>
                                                            <p className="pt-1">
                                                                {instruction}
                                                            </p>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ol>
                                    </div>
                                ))}
                            </div>

                            <h2 className="mt-8 text-2xl font-semibold">
                                Commentaires
                            </h2>
                            <p className="mt-4">À venir... (lol)</p>
                        </div>

                        {/* Sticky ingredients panel - desktop only */}
                        <div className="hidden lg:block lg:w-80 p-6 lg:border-l">
                            <div className="sticky top-6">
                                <h2 className="text-xl font-semibold">
                                    Ingrédients
                                </h2>
                                <Separator className="my-4" />
                                <ScrollArea className="h-[calc(100vh-200px)]">
                                    <ul className="space-y-4">
                                        {recipe.ingredients.map(
                                            (ingredient, index) => (
                                                <CrossableCheckbox
                                                    id={ingredient}
                                                    key={index}
                                                >
                                                    {ingredient}
                                                </CrossableCheckbox>
                                            )
                                        )}
                                    </ul>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Floating ingredients button for mobile */}
            <div className="fixed bottom-6 right-6 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-lg"
                        >
                            <List className="h-6 w-6" />
                            <span className="sr-only">
                                Voir les ingrédients
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[60vh]">
                        <div className="pt-6">
                            <h2 className="text-xl font-semibold">
                                Ingrédients
                            </h2>
                            <Separator className="my-4" />
                            <ScrollArea className="h-[calc(60vh-100px)]">
                                <ul className="space-y-2">
                                    {recipe.ingredients.map(
                                        (ingredient, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2"
                                            >
                                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                                <span>{ingredient}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </ScrollArea>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}

import Image from 'next/image';
import type { Recipe } from '@prisma/client';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { CrossableCheckbox } from '@/components/ui/crossable-checkbox';

import {
    SidebarProvider,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarGroupContent,
    SidebarMenu,
    SidebarGroup,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

function IngredientSidebar({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <ScrollArea className="h-screen w-full">
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </ScrollArea>

            <Sidebar side="right">
                <SidebarHeader>INGRÉDIENTS</SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                                <p>ici les items</p>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
}

export default async function Recipe({ recipe }: { recipe: RecipeUi }) {
    return (
        <IngredientSidebar>
            <div className="">
                <div className="relative h-3/6">
                    <Image
                        src={`/api/image-proxy?imageId=${recipe.picture}`}
                        fill
                        alt="recipe top view"
                        className="object-cover"
                    />
                </div>

                <div className="mx-16">
                    <h3 className="my-16 text-center text-5xl font-bold leading-[1.2] tracking-tight">
                        {recipe.title}
                    </h3>

                    <div className="flex items-center space-x-2">
                        <CrossableCheckbox id="non">
                            Accept terms and conditions
                        </CrossableCheckbox>
                    </div>

                    <div className="flex">
                        <div className="w-2/3 overflow-y-auto p-4">
                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>

                            <h2 className="text-xl font-bold mb-4">
                                Recipe Steps
                            </h2>
                            <p className="mb-6">
                                Step 1: Prepare ingredients...
                            </p>
                            <p className="mb-6">Step 2: Start cooking...</p>
                            <p className="mb-6">Step 3: Finish up...</p>
                        </div>

                        <div className="w-1/3 p-4 overflow-y-auto">
                            <div className="sticky top-0">
                                <h2 className="text-xl font-bold mb-4">
                                    Ingredients
                                </h2>
                                <ul className="list-disc ml-5">
                                    <li>1 cup of flour</li>
                                    <li>2 eggs</li>
                                    <li>1/2 cup of sugar</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </IngredientSidebar>
    );
}

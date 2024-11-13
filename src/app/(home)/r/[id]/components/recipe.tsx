import Image from 'next/image';
import type { Recipe } from '@prisma/client';
import type { RecipeUi } from '@/lib/model/recipe-ui';
import { CustomTrigger, IngredientSidebar } from './ingredients-sidebar';

export default async function Recipe({ recipe }: { recipe: RecipeUi }) {
    return (
        <IngredientSidebar>
            <div className="h-screen">
                <CustomTrigger />
                <div className="relative h-3/6">
                    <Image
                        src={`/api/image-proxy?imageId=${recipe.picture}`}
                        fill
                        alt="recipe top view"
                        className="object-cover"
                    />
                </div>

                <div className="mx-16">
                    <h3 className="my-16 text-center text-4xl font-bold leading-[1.2] tracking-tight">
                        {recipe.title}
                    </h3>

                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>

                        <h2 className="text-xl font-bold mb-4">Recipe Steps</h2>
                        <p className="mb-6">Step 1: Prepare ingredients...</p>
                        <p className="mb-6">Step 2: Start cooking...</p>
                        <p className="mb-6">Step 3: Finish up...</p>
                    </div>
                </div>
            </div>
        </IngredientSidebar>
    );
}

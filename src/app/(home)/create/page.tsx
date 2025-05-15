import { getTags } from '@/lib/api/tags';
import CreateRecipeFormLegacy from './components/create-recipe-form';
import { CreateRecipeForm } from './components/create-recipe-v2';

export const dynamic = 'force-dynamic';

export default async function CreateRecipePage() {
    const tags = await getTags();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="container flex items-center justify-between h-16 px-4">
                    <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                        Créer une nouvelle recette
                    </h1>
                </div>
            </header>
            <section className="flex-1 container px-4 py-6">
                <CreateRecipeForm />
            </section>
        </div>
    );
}

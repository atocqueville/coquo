import { getTags } from '@/lib/api/tags';
import CreateRecipeForm from './components/create-recipe-form';

export const dynamic = 'force-dynamic';

export default async function CreateRecipePage() {
    const tags = await getTags();

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container py-6 px-4 md:py-10">
                <CreateRecipeForm tags={tags} />
            </div>
        </div>
    );
}

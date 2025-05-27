import { getTags } from '@/lib/api/tags';
import { CreateRecipeForm } from './components/create-recipe-form';
import { PageContainer, PageTitle } from '@/components/page-wrapper';

export const dynamic = 'force-dynamic';

export default async function CreateRecipePage() {
    const tags = await getTags();

    return (
        <PageContainer>
            <PageTitle title="Créer une nouvelle recette" />
            <CreateRecipeForm tags={tags} />
        </PageContainer>
    );
}

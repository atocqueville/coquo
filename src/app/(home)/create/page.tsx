import { getTags } from '@/lib/api/tags';
import { CreateRecipeForm } from './components/create-recipe-form';
import { PageContainer, PageTitle } from '@/components/page-wrapper';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function CreateRecipePage() {
    const tags = await getTags();
    const t = await getTranslations('CreateRecipePage');

    return (
        <PageContainer>
            <PageTitle title={t('title')} />
            <CreateRecipeForm tags={tags} />
        </PageContainer>
    );
}

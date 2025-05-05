import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function CookBookPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <TopBar />
            <RecipeList />
        </div>
    );
}

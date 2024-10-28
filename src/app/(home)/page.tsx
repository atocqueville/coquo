import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <div className="flex flex-col gap-4 m-8">
            <TopBar />
            <RecipeList />
        </div>
    );
}

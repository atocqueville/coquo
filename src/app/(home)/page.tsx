import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';

export const dynamic = 'force-dynamic';

export default function CookBookPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <RecipeList />
        </div>
    );
}

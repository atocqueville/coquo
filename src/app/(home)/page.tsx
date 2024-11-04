import TopBar from './components/top-bar';
import RecipeList from './components/recipe-list';

export const dynamic = 'force-dynamic';

export default function CookBookPage() {
    return (
        <div className="mb-8">
            <TopBar />
            <RecipeList />
        </div>
    );
}

import CreateRecipeForm from './components/create-recipe-form';

export default function CreateRecipePage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container py-6 px-4 md:py-10">
                <CreateRecipeForm />
            </div>
        </div>
    );
}

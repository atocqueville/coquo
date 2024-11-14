import { CreateRecipeForm } from './components/create-recipe-form';

export default function CreateRecipePage() {
    return (
        <div className="mx-20 my-20">
            <div className="max-w-5xl mx-auto flex flex-col bg-white rounded-md">
                <div className="m-10">
                    <CreateRecipeForm />
                </div>
            </div>
        </div>
    );
}

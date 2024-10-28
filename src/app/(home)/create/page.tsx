import { createRecipe } from '@/lib/api/recipe';

export default function CreateForm() {
    return (
        <div>
            <form action={createRecipe}>
                <h1>New Post</h1>
                <input name="title" placeholder="Title" />
                <input name="content" placeholder="Content" />

                <button color="secondary" type="submit">
                    Create Post{' '}
                </button>
            </form>
        </div>
    );
}

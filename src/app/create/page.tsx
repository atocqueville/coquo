import ButtonLink from '@/components/button-link'
import { createPost } from '@/lib/actions'

const CreateForm = () => {
    return (
        <div>
            <form action={createPost}>
                <h1>New Post</h1>
                <input name="title" placeholder="Title" />
                <input name="content" placeholder="Content" />

                <button color="secondary" type="submit">
                    Create Post{' '}
                </button>

                <ButtonLink path="/posts">Go back to posts list !</ButtonLink>
            </form>
        </div>
    )
}

export default CreateForm

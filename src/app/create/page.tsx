import ButtonLink from '../../components/button-link';
import {Input, Button} from "@nextui-org/react";
import { createPost } from '../../lib/actions';

const CreateForm = () => {

  return (
      <div>
        <form action={createPost}>
          <h1>New Post</h1>
          <Input name="title" placeholder="Title"  />
          <Input name="content" placeholder="Content" />
 
         
          <Button color='secondary' type="submit">Create Post </Button>

            <ButtonLink path='/posts'>Go back to posts list !</ButtonLink>

        </form>
      </div>
     
  );
};

export default CreateForm;
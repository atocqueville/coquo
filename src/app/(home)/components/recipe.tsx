import type { Recipe } from '@prisma/client';
import { MEDIA_STORAGE_MEDIAL_URL } from '@/lib/api/express.constants';

export default function Recipe({ recipe }: { recipe: Recipe }) {
    return (
        <div>
            <img
                src={`${MEDIA_STORAGE_MEDIAL_URL}/${recipe.picture}`}
                alt={'recipe top view'}
            />
            <p>{recipe.title}</p>
        </div>
    );
}

{
    /* <div
                    
className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground
text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
> */
}

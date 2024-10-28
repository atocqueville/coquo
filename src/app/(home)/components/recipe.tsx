import type { Recipe } from '@prisma/client';

export default function Recipe({ recipe }: { recipe: Recipe }) {
    return (
        <div>
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

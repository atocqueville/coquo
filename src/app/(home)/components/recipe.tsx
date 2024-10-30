import Image from 'next/image';
import type { Recipe } from '@prisma/client';

export default async function Recipe({ recipe }: { recipe: Recipe }) {
    const imageUrl = `/api/image-proxy?imageId=${recipe.picture}`;

    return (
        <div>
            <Image
                src={imageUrl}
                width={250}
                height={250}
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

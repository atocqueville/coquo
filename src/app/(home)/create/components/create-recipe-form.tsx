'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createRecipe } from '@/lib/api/recipe';
import { uploadImage } from '@/lib/api/file-storage';
import { SpinnerIcon } from '@/components/icons';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const createRecipeSchema = z.object({
    title: z.string().min(1),
    // ingredients: z.string().min(1),
    // steps: z.array(z.string().min(1)),
    picture: z.any(),
});
export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;

export function CreateRecipeForm({ className, ...props }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateRecipeFormData>({
        resolver: zodResolver(createRecipeSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function onSubmit(data: CreateRecipeFormData) {
        setIsLoading(true);
        try {
            const uploadFileResponse = await uploadImage(data.picture);
            // delete data.picture;
            await createRecipe(data, uploadFileResponse.path);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="title">
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Titre de la recette"
                            type="text"
                            {...register('title')}
                        />
                        {errors?.title && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.title.message}
                            </p>
                        )}
                        {/* <Input
                            id="ingredients"
                            placeholder="Ingredients"
                            type="text"
                            {...register('ingredients')}
                        />
                        {errors?.ingredients && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.ingredients.message}
                            </p>
                        )} */}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Picture</Label>
                            <Input
                                id="picture"
                                type="file"
                                {...register('picture')}
                            />
                        </div>
                    </div>
                    <button
                        className={cn(buttonVariants())}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Ajouter la recette
                    </button>
                </div>
            </form>

            {/* 
             TO ADD BACK WHEN IMPLEMENTING GOOGLE AUTH
             
             
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <button
                type="button"
                className={cn(buttonVariants({ variant: 'outline' }))}
                onClick={() => {
                    setIsGitHubLoading(true);
                    signIn('github');
                }}
                disabled={isLoading || isGitHubLoading}
            >
                {isGitHubLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{' '}
                Github
            </button> */}
        </div>
    );
}

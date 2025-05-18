import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
    code: z.optional(z.string()),
});

export const userAuthSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
        name: z.string(),
    })
    .refine(
        ({ password, passwordConfirmation }) =>
            password === passwordConfirmation,
        {
            path: ['passwordConfirmation'],
            message: 'Les mots de passe ne correspondent pas',
        }
    );

export const UserLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const CreateRecipeSchema = z.object({
    title: z.string().min(1),
    picture: z.string().optional(),
    ingredients: z.array(z.string()).min(1),
    steps: z
        .array(
            z.object({
                title: z.string().min(1),
                instructions: z.array(z.string()).min(1),
            })
        )
        .min(1),
    servings: z.number().min(1).max(20),
    prepTime: z.number().min(0),
    cookTime: z.number().min(0),
    tags: z.array(z.string()).min(0),
    difficulty: z.number().min(1).max(3),
});

'use client';

import * as React from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const userAuthSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
        friendlyName: z.string(),
    })
    .refine(
        ({ password, passwordConfirmation }) =>
            password === passwordConfirmation,
        {
            path: ['passwordConfirmation'],
            message: 'Les mots de passe ne correspondent pas',
        }
    );

const SpinnerIcon = (props: React.HTMLAttributes<SVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

type FormData = z.infer<typeof userAuthSchema>;

export function RegisterForm({ className, ...props }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAuthSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function onSubmit(data: FormData) {
        setIsLoading(true);
        console.log(data);
        setIsLoading(false);
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register('email')}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                        <Input
                            id="password"
                            placeholder="Mot de passe"
                            type="password"
                            disabled={isLoading}
                            {...register('password')}
                        />
                        {errors?.password && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                        <Input
                            id="passwordConfirmation"
                            placeholder="Confirmer le mot de passe"
                            type="password"
                            disabled={isLoading}
                            {...register('passwordConfirmation')}
                        />
                        {errors?.passwordConfirmation && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.passwordConfirmation.message}
                            </p>
                        )}
                        <Input
                            id="friendlyName"
                            placeholder="Ton petit surnom"
                            type="friendlyName"
                            disabled={isLoading}
                            {...register('friendlyName')}
                        />
                        {errors?.friendlyName && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.friendlyName.message}
                            </p>
                        )}
                    </div>
                    <button
                        className={cn(buttonVariants())}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </button>
                </div>
            </form>
        </div>
    );
}

'use client';

import * as React from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import { SpinnerIcon } from '@/components/icons';
import { UserLoginSchema } from '@/schemas';
import { AuthError } from '@auth/core/errors';

type FormData = z.infer<typeof UserLoginSchema>;

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(UserLoginSchema),
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function onSubmit(data: FormData) {
        setIsLoading(true);
        try {
            await signIn('credentials', {
                ...data,
                redirectTo: '/',
            });
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.name) {
                    case 'CredentialsSignin':
                        return { error: 'Invalid credentials!' };
                    default:
                        return { error: 'Something went wrong!' };
                }
            }

            throw error;
        }
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
                <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                        Email
                    </Label>
                    <Input
                        id="email"
                        placeholder="email@exemple.com"
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
                </div>
                <button className={cn(buttonVariants())} disabled={isLoading}>
                    {isLoading && (
                        <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Se connecter
                </button>
            </div>
        </form>
    );
}

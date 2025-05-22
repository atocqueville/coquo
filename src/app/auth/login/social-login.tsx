'use client';

import * as React from 'react';
import { FcGoogle } from 'react-icons/fc';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { SpinnerIcon } from '@/components/icons';

export function SocialLogin() {
    const [isGoogleLoading, setIsGoogleLoading] =
        React.useState<boolean>(false);

    return (
        <>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou connectez-vous avec
                    </span>
                </div>
            </div>
            <button
                type="button"
                className={cn(buttonVariants({ variant: 'outline' }))}
                onClick={() => {
                    setIsGoogleLoading(true);
                    signIn('google');
                }}
                disabled={isGoogleLoading}
            >
                {isGoogleLoading ? (
                    <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FcGoogle className="mr-2 h-4 w-4" />
                )}{' '}
                Google
            </button>
        </>
    );
}

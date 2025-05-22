import { Metadata } from 'next';
import Link from 'next/link';

import { CookingPotIcon } from 'lucide-react';
import { LoginForm } from '@/app/auth/login/login-form';
import { SocialLogin } from './social-login';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account',
};

export default function LoginPage() {
    // Check if Google auth environment variables are set
    const showSocialLogin =
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

    return (
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <CookingPotIcon className="mx-auto h-6 w-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bienvenue
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Entrez votre email pour vous connecter à votre compte
                    </p>
                </div>
                <div className="grid gap-6">
                    <LoginForm />
                    {showSocialLogin && <SocialLogin />}
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/auth/register"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Pas de compte ? Inscrivez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
}

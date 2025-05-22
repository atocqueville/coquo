import { RegisterForm } from '@/app/auth/register/register-form';
import { UserRoundPen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Créer un compte',
    description: 'Créez un compte pour commencer.',
};

export default function RegisterPage() {
    return (
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <UserRoundPen className="mx-auto h-6 w-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Créer un compte
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Entrez votre email ci-dessous pour créer votre compte
                    </p>
                </div>
                <RegisterForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/auth/login"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        J&apos;ai déjà un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}

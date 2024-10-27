import { RegisterForm } from '@/app/api/auth/(custom-auth)/register/register-form';
import { UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
    title: 'Create an account',
    description: 'Create an account to get started.',
};

export default function RegisterPage() {
    return (
        <>
            <Link
                href="/api/auth/login"
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 md:right-8 md:top-8'
                )}
            >
                Login
            </Link>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <UserRoundPen className="mx-auto h-6 w-6" />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </>
    );
}

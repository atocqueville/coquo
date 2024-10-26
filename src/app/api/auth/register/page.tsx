import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { RegisterForm } from '@/app/api/auth/register/register-form';
import { UserRoundPen } from 'lucide-react';
import healthyFoodImage from '../../../../../public/healthy-food.jpg';

export const metadata = {
    title: 'Create an account',
    description: 'Create an account to get started.',
};

export default function RegisterPage() {
    return (
        <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/api/auth/login"
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 md:right-8 md:top-8'
                )}
            >
                Login
            </Link>
            <div
                className="hidden h-full bg-emerald-500 lg:block"
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                <Image
                    alt="Healthy food"
                    src={healthyFoodImage}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
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
        </div>
    );
}

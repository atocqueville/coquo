'use client';

import { signOut } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
    className?: string;
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
    const router = useRouter();
    return (
        <Button
            variant="outline"
            className={className}
            onClick={() =>
                signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push('/');
                        },
                    },
                })
            }
        >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
        </Button>
    );
};

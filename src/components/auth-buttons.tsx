'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
    className?: string;
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
    return (
        <Button
            variant="outline"
            className={className}
            onClick={() => signOut({ redirectTo: '/' })}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
        </Button>
    );
};

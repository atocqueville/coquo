'use client';

import { useCurrentRole } from '@/hooks/use-current-role';
import { ErrorCard } from '@/components/error-card';

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: 'USER' | 'ADMIN';
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <ErrorCard message="You do not have permission to view this content." />
        );
    }

    return <>{children}</>;
};

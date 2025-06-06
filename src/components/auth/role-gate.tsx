'use client';

import { useTranslations } from 'next-intl';
import { useCurrentRole } from '@/hooks/use-current-role';
import { ErrorCard } from '@/components/error-card';

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: 'USER' | 'ADMIN';
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();
    const t = useTranslations('common.ErrorMessage');

    if (role !== allowedRole) {
        return <ErrorCard message={t('permissionDenied')} />;
    }

    return <>{children}</>;
};

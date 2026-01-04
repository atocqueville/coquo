'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function AutoVerificationChecker() {
    const { data: session, isPending, refetch } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [hasChecked, setHasChecked] = useState(false);
    const t = useTranslations('common.AutoVerificationChecker');

    useEffect(() => {
        // Auto-check verification status
        const checkVerificationStatus = async () => {
            try {
                // Force a session refresh
                await refetch();
                setHasChecked(true);
            } catch (error) {
                console.error('Verification check failed:', error);
                toast.error(t('verificationError'));
                setIsChecking(false);
            }
        };

        // Only run once when we have a session
        if (session && !hasChecked) {
            checkVerificationStatus();
        }
    }, [session?.user?.id, hasChecked]);

    // Check verification after refetch completes
    useEffect(() => {
        if (hasChecked && session && !isPending) {
            const isVerified =
                !!session.user?.emailVerified || session.user?.role === 'ADMIN';

            if (isVerified) {
                toast.success(t('accountVerified'));
                router.push('/');
            } else {
                toast.info(t('accountNotVerified'));
                setIsChecking(false);
            }
        }
    }, [hasChecked, session, isPending]);

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
                {isChecking ? (
                    <strong>{t('checkingInProgress')}</strong>
                ) : (
                    <strong>{t('pendingValidation')}</strong>
                )}{' '}
                {t('automaticCheck')}
            </p>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function AutoVerificationChecker() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const t = useTranslations('common.AutoVerificationChecker');

    useEffect(() => {
        // Auto-check verification status
        const checkVerificationStatus = async () => {
            try {
                // Force a session update to get fresh data from the database
                const updatedSession = await update();

                // Check if user is now verified
                const isVerified =
                    !!updatedSession?.user?.emailVerified ||
                    updatedSession?.user?.role === 'ADMIN';

                if (isVerified) {
                    toast.success(t('accountVerified'));
                    router.push('/');
                    return; // Don't set isChecking to false if redirecting
                } else {
                    toast.info(t('accountNotVerified'));
                }
            } catch (error) {
                console.error('Verification check failed:', error);
                toast.error(t('verificationError'));
            }
            setIsChecking(false);
        };

        // Only run if we have a session
        if (session) {
            checkVerificationStatus();
        }
    }, [session?.user?.id]); // Depend on user ID to run when session is available

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

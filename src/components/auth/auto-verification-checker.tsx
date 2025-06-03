'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function AutoVerificationChecker() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

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
                    toast.success('Votre compte a été vérifié avec succès !');
                    router.push('/');
                    return; // Don't set isChecking to false if redirecting
                } else {
                    toast.info("Votre compte n'est pas encore vérifié.");
                }
            } catch (error) {
                console.error('Verification check failed:', error);
                toast.error(
                    'Erreur lors de la vérification du statut de votre compte'
                );
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
                    <strong>Vérification en cours...</strong>
                ) : (
                    <strong>Compte en attente de validation</strong>
                )}{' '}
                La page vérifie automatiquement le statut de votre compte.
                Actualisez la page si votre compte a été validé.
            </p>
        </div>
    );
}

'use client';

import type React from 'react';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { signOut } from 'next-auth/react';
import type { User } from '@prisma/client';
import { updateUser } from '@/lib/api/user';
import { toast } from 'sonner';

export default function AccountTab({ currentUser }: { currentUser: User }) {
    const [name, setName] = useState(currentUser.name);
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser(currentUser.id, { name });
            toast.success('Profil mis à jour avec succès');
        } catch {
            toast.error(
                'Une erreur est survenue lors de la mise à jour du profil'
            );
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Profil</CardTitle>
                    <CardDescription>
                        Gérez vos informations personnelles et vos préférences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    value={name ?? ''}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="coquo">
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Session</CardTitle>
                    <CardDescription>
                        Gérez votre session actuelle.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                Connecté en tant que {currentUser.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Membre depuis le{' '}
                                {new Date(
                                    currentUser.createdAt
                                ).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <Dialog
                            open={showSignOutDialog}
                            onOpenChange={setShowSignOutDialog}
                        >
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Déconnexion
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Confirmer la déconnexion
                                    </DialogTitle>
                                    <DialogDescription>
                                        Êtes-vous sûr de vouloir vous
                                        déconnecter ? Vous devrez vous
                                        reconnecter pour accéder à votre compte.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowSignOutDialog(false)
                                        }
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => signOut()}
                                    >
                                        Déconnexion
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

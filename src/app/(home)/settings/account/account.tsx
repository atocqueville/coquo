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

// Mock user data
const currentUser = {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'admin', // Change to "user" to hide admin section
    avatar: '/placeholder.svg?height=100&width=100',
    createdAt: '2023-01-15',
};

export default function AccountTab() {
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would update the user profile
        console.log('Profile updated:', { name, email });
        // Show success message
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would update the password
        console.log('Password changed');
        // Reset form and show success message
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSignOut = () => {
        // Here you would sign out the user
        console.log('User signed out');
        // Redirect to login page
        window.location.href = '/';
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>
                        Mettez à jour votre mot de passe pour sécuriser votre
                        compte.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">
                                Mot de passe actuel
                            </Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">
                                    Nouveau mot de passe
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">
                                    Confirmer le mot de passe
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">
                                Changer le mot de passe
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
                                        onClick={handleSignOut}
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

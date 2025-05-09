'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RoleGate } from '@/components/auth/role-gate';
import type { User } from '@prisma/client';
import { verifyUser, blockUser, unblockUser } from '@/lib/api/user';
import { toast } from 'sonner';

export default function AdministrationTab({
    unverifiedUsers,
    blockedUsers,
}: {
    unverifiedUsers: User[];
    blockedUsers: User[];
}) {
    const [unverifiedUsersOptimistic, setUnverifiedUsersOptimistic] =
        useState(unverifiedUsers);
    const [blockedUsersOptimistic, setBlockedUsersOptimistic] =
        useState(blockedUsers);
    const handleApproveUser = (userId: string) => {
        try {
            verifyUser(userId);
            toast.success('Compte validé avec succès');
            setUnverifiedUsersOptimistic(
                unverifiedUsersOptimistic.filter((user) => user.id !== userId)
            );
        } catch (error) {
            console.error(error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const handleRejectUser = (userId: string) => {
        try {
            blockUser(userId);
            toast.success('Compte rejeté avec succès');

            // Find the user before removing from unverified list
            const userToBlock = unverifiedUsersOptimistic.find(
                (user) => user.id === userId
            );

            // Remove from unverified list
            setUnverifiedUsersOptimistic(
                unverifiedUsersOptimistic.filter((user) => user.id !== userId)
            );

            // Add to blocked list if user was found
            if (userToBlock) {
                setBlockedUsersOptimistic([
                    ...blockedUsersOptimistic,
                    userToBlock,
                ]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const handleUnblockUser = (userId: string) => {
        try {
            unblockUser(userId);
            toast.success('Compte débloqué avec succès');

            // Find the user before removing from blocked list
            const userToUnblock = blockedUsersOptimistic.find(
                (user) => user.id === userId
            );

            // Remove from blocked list
            setBlockedUsersOptimistic(
                blockedUsersOptimistic.filter((user) => user.id !== userId)
            );

            // Add to unverified list if user was found
            if (userToUnblock) {
                setUnverifiedUsersOptimistic([
                    ...unverifiedUsersOptimistic,
                    userToUnblock,
                ]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <RoleGate allowedRole="ADMIN">
            <Card>
                <CardHeader>
                    <CardTitle>Validation des comptes</CardTitle>
                    <CardDescription>
                        Approuvez ou rejetez les demandes d&apos;inscription en
                        attente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {unverifiedUsersOptimistic.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date de demande</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {unverifiedUsersOptimistic.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="default">
                                                En attente
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-green-500"
                                                    onClick={() =>
                                                        handleApproveUser(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <Check className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Approuver
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500"
                                                    onClick={() =>
                                                        handleRejectUser(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Rejeter
                                                    </span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                            <p className="text-muted-foreground">
                                Aucune demande en attente
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Comptes bloqués</CardTitle>
                    <CardDescription>
                        Liste des comptes bloqués.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Date de demande</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blockedUsersOptimistic.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">Bloqué</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleUnblockUser(user.id)
                                            }
                                        >
                                            Débloquer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </RoleGate>
    );
}

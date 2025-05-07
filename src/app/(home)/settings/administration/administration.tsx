'use client';

import type React from 'react';

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

// Mock unverified users
const unverifiedUsers = [
    {
        id: 2,
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        role: 'user',
        requestedAt: '2023-05-10',
    },
    {
        id: 3,
        name: 'Pierre Dubois',
        email: 'pierre.dubois@example.com',
        role: 'user',
        requestedAt: '2023-05-12',
    },
    {
        id: 4,
        name: 'Sophie Leroy',
        email: 'sophie.leroy@example.com',
        role: 'user',
        requestedAt: '2023-05-15',
    },
];

export default function AdministrationTab() {
    const [pendingUsers, setPendingUsers] = useState(unverifiedUsers);

    const handleApproveUser = (userId: number) => {
        // Here you would approve the user in your backend
        console.log('Approved user:', userId);
        // Remove from pending list
        setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
    };

    const handleRejectUser = (userId: number) => {
        // Here you would reject the user in your backend
        console.log('Rejected user:', userId);
        // Remove from pending list
        setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
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
                    {pendingUsers.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date de demande</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                user.requestedAt
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
        </RoleGate>
    );
}

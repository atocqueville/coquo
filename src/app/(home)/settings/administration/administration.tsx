'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
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
import { approveUser, banUser, unbanUser } from '@/lib/api/user';
import { toast } from 'sonner';
import type { User } from '@/lib/prisma';

export default function AdministrationTab({
    pendingUsers,
    blockedUsers,
}: {
    pendingUsers: User[];
    blockedUsers: User[];
}) {
    console.log('p', pendingUsers);
    const t = useTranslations('SettingsPage.AdministrationTab');
    const currentLocale = useLocale();
    const [pendingUsersOptimistic, setPendingUsersOptimistic] =
        useState(pendingUsers);
    const [blockedUsersOptimistic, setBlockedUsersOptimistic] =
        useState(blockedUsers);
    const handleApproveUser = (userId: string) => {
        try {
            approveUser(userId);
            toast.success(t('notifications.accountValidated'));
            setPendingUsersOptimistic(
                pendingUsersOptimistic.filter((user) => user.id !== userId)
            );
        } catch {
            toast.error(t('notifications.error'));
        }
    };

    const handleBanUser = (userId: string) => {
        try {
            banUser(userId);
            toast.success(t('notifications.accountBanned'));

            // Find the user before removing from pending list
            const userToBlock = pendingUsersOptimistic.find(
                (user) => user.id === userId
            );

            // Remove from pending list
            setPendingUsersOptimistic(
                pendingUsersOptimistic.filter((user) => user.id !== userId)
            );

            // Add to blocked list if user was found
            if (userToBlock) {
                setBlockedUsersOptimistic([
                    ...blockedUsersOptimistic,
                    userToBlock,
                ]);
            }
        } catch {
            toast.error(t('notifications.error'));
        }
    };

    const handleUnbanUser = (userId: string) => {
        try {
            unbanUser(userId);
            toast.success(t('notifications.accountUnbanned'));

            // Find the user before removing from blocked list
            const userToUnblock = blockedUsersOptimistic.find(
                (user) => user.id === userId
            );

            // Remove from blocked list
            setBlockedUsersOptimistic(
                blockedUsersOptimistic.filter((user) => user.id !== userId)
            );

            // Add to pending list if user was found
            if (userToUnblock) {
                setPendingUsersOptimistic([
                    ...pendingUsersOptimistic,
                    userToUnblock,
                ]);
            }
        } catch {
            toast.error(t('notifications.error'));
        }
    };

    return (
        <RoleGate allowedRole="admin">
            <Card>
                <CardHeader>
                    <CardTitle>{t('accountValidation.title')}</CardTitle>
                    <CardDescription>
                        {t('accountValidation.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingUsersOptimistic.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('table.headers.user')}
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            {t('table.headers.email')}
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            {t('table.headers.date')}
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            {t('table.headers.status')}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t('table.headers.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingUsersOptimistic.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div className="font-medium">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground sm:hidden">
                                                        {user.email}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground md:hidden">
                                                        {new Date(
                                                            user.createdAt
                                                        ).toLocaleDateString(
                                                            currentLocale
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString(
                                                    currentLocale
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="coquo">
                                                    {t('table.status.pending')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
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
                                                            {t(
                                                                'table.actions.approve'
                                                            )}
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500"
                                                        onClick={() =>
                                                            handleBanUser(
                                                                user.id
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            {t(
                                                                'table.actions.ban'
                                                            )}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                            <p className="text-muted-foreground">
                                {t('empty.noPendingRequests')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('bannedAccounts.title')}</CardTitle>
                    <CardDescription>
                        {t('bannedAccounts.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t('table.headers.user')}
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        {t('table.headers.email')}
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        {t('table.headers.date')}
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        {t('table.headers.status')}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t('table.headers.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blockedUsersOptimistic.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground sm:hidden">
                                                    {user.email}
                                                </div>
                                                <div className="text-xs text-muted-foreground md:hidden">
                                                    {new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString(
                                                        currentLocale
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString(currentLocale)}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="default">
                                                {t('table.status.banned')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() =>
                                                    handleUnbanUser(user.id)
                                                }
                                            >
                                                {t('table.actions.unban')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </RoleGate>
    );
}

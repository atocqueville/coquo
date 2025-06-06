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
    const t = useTranslations('SettingsPage.AdministrationTab');
    const currentLocale = useLocale();
    const [unverifiedUsersOptimistic, setUnverifiedUsersOptimistic] =
        useState(unverifiedUsers);
    const [blockedUsersOptimistic, setBlockedUsersOptimistic] =
        useState(blockedUsers);
    const handleApproveUser = (userId: string) => {
        try {
            verifyUser(userId);
            toast.success(t('notifications.accountValidated'));
            setUnverifiedUsersOptimistic(
                unverifiedUsersOptimistic.filter((user) => user.id !== userId)
            );
        } catch {
            toast.error(t('notifications.error'));
        }
    };

    const handleRejectUser = (userId: string) => {
        try {
            blockUser(userId);
            toast.success(t('notifications.accountRejected'));

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
        } catch {
            toast.error(t('notifications.error'));
        }
    };

    const handleUnblockUser = (userId: string) => {
        try {
            unblockUser(userId);
            toast.success(t('notifications.accountUnblocked'));

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
        } catch {
            toast.error(t('notifications.error'));
        }
    };

    return (
        <RoleGate allowedRole="ADMIN">
            <Card>
                <CardHeader>
                    <CardTitle>{t('accountValidation.title')}</CardTitle>
                    <CardDescription>
                        {t('accountValidation.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {unverifiedUsersOptimistic.length > 0 ? (
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
                                    {unverifiedUsersOptimistic.map((user) => (
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
                                                            handleRejectUser(
                                                                user.id
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            {t(
                                                                'table.actions.reject'
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
                    <CardTitle>{t('blockedAccounts.title')}</CardTitle>
                    <CardDescription>
                        {t('blockedAccounts.description')}
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
                                                {t('table.status.blocked')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() =>
                                                    handleUnblockUser(user.id)
                                                }
                                            >
                                                {t('table.actions.unblock')}
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

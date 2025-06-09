'use client';

import type React from 'react';

import { useState } from 'react';
import { LogOut, Languages } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    const t = useTranslations('SettingsPage.AccountTab');
    const currentLocale = useLocale();
    const [name, setName] = useState(currentUser.name);
    const [locale, setLocale] = useState(currentUser.locale || 'auto');
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);

    const handleProfileUpdate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            await updateUser(currentUser.id, {
                name,
                locale: locale === 'auto' ? null : locale,
            });
            toast.success(t('notifications.profileUpdated'));
            // Force reload to apply new locale
            window.location.reload();
        } catch {
            toast.error(t('notifications.profileUpdateError'));
        }
    };

    const localeOptions = [
        { value: 'auto', label: t('language.options.auto') },
        { value: 'fr', label: t('language.options.fr') },
        { value: 'en', label: t('language.options.en') },
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.title')}</CardTitle>
                    <CardDescription>
                        {t('profile.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                {t('profile.nameLabel')}
                            </Label>
                            <Input
                                id="name"
                                value={name ?? ''}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="coquo">
                                {t('profile.saveButton')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        {t('language.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('language.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="locale-setting">
                                {t('language.languageLabel')}
                            </Label>
                            <Select value={locale} onValueChange={setLocale}>
                                <SelectTrigger id="locale-setting">
                                    <SelectValue
                                        placeholder={t(
                                            'language.selectPlaceholder'
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {localeOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleProfileUpdate}
                                variant="coquo"
                                type="button"
                            >
                                {t('language.saveButton')}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('session.title')}</CardTitle>
                    <CardDescription>
                        {t('session.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                {t('session.loggedInAs')} {currentUser.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('session.memberSince')}{' '}
                                {new Date(
                                    currentUser.createdAt
                                ).toLocaleDateString(currentLocale)}
                            </p>
                        </div>
                        <Dialog
                            open={showSignOutDialog}
                            onOpenChange={setShowSignOutDialog}
                        >
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('session.signOutButton')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {t('session.signOutDialog.title')}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {t('session.signOutDialog.description')}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowSignOutDialog(false)
                                        }
                                    >
                                        {t('session.signOutDialog.cancel')}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => signOut()}
                                    >
                                        {t('session.signOutDialog.confirm')}
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

'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const FormSchema = z
    .object({
        currentPassword: z.string().min(6, {
            message: 'Le mot de passe doit contenir au moins 6 caractères',
        }),
        newPassword: z.string().min(6, {
            message:
                'Le  nouveau mot de passe doit contenir au moins 6 caractères',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Le mot de passe doit contenir au moins 6 caractères',
        }),
    })
    .refine(
        ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
        {
            path: ['confirmPassword'],
            message: 'Les mots de passe ne correspondent pas',
        }
    );

export default function AccountPassword({ userId }: { userId: string }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data, userId);
    }

    // const handlePasswordChange = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         if (newPassword !== confirmPassword) {
    //             throw new Error('Les mots de passe ne correspondent pas');
    //         }
    //         await updatePassword(userId, {
    //             currentPassword: currentPassword,
    //             newPassword: newPassword,
    //         });
    //         toast.success('Mot de passe mis à jour avec succès');
    //         setCurrentPassword('');
    //         setNewPassword('');
    //         setConfirmPassword('');
    //     } catch (err) {
    //         toast.error(
    //             err instanceof Error ? err.message : 'Une erreur est survenue'
    //         );
    //     }
    // };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                    Mettez à jour votre mot de passe pour sécuriser votre
                    compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-2/3 space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe actuel</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Mot de passe actuel"
                                            type="password"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nouveau mot de passe
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nouveau mot de passe"
                                                type="password"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Confirmer le mot de passe
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Confirmer le mot de passe"
                                                type="password"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                {/* <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">
                            Mot de passe actuel
                        </Label>
                        <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
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
                                onChange={(e) => setNewPassword(e.target.value)}
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
                        <Button type="submit">Changer le mot de passe</Button>
                    </div>
                </form> */}
            </CardContent>
        </Card>
    );
}

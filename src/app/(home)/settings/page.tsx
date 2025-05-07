'use client';

import type React from 'react';
import { User, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdministrationTab from '@/app/(home)/settings/administration/administration';
import AccountTab from '@/app/(home)/settings/account/account';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container py-6 px-4 md:py-10">
                <div className="mb-6 flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Paramètres</h1>
                </div>

                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="account">
                            <User className="mr-2 h-4 w-4" />
                            Compte
                        </TabsTrigger>

                        <TabsTrigger value="admin">
                            <Shield className="mr-2 h-4 w-4" />
                            Administration
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="space-y-6">
                        <AccountTab />
                    </TabsContent>

                    <TabsContent value="admin" className="space-y-6">
                        <AdministrationTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

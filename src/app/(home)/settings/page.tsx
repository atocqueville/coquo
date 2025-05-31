import type React from 'react';
import { User, Shield, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountWrapper from '@/app/(home)/settings/account/account-wrapper';
import AdministrationWrapper from './administration/administration-wrapper';
import CustomizationTab from './customization/customization';
import { PageContainer, PageTitle } from '@/components/page-wrapper';

export default function SettingsPage() {
    return (
        <PageContainer>
            <PageTitle title="Paramètres" />
            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="account">
                        <User className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Compte</span>
                    </TabsTrigger>

                    <TabsTrigger value="customization">
                        <Palette className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">
                            Personnalisation
                        </span>
                    </TabsTrigger>

                    <TabsTrigger value="admin">
                        <Shield className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Administration</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6">
                    <AccountWrapper />
                </TabsContent>

                <TabsContent value="customization" className="space-y-6">
                    <CustomizationTab />
                </TabsContent>

                <TabsContent value="admin" className="space-y-6">
                    <AdministrationWrapper />
                </TabsContent>
            </Tabs>
        </PageContainer>
    );
}

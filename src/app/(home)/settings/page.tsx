import type React from 'react';
import { User, Shield, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountWrapper from '@/app/(home)/settings/account/account-wrapper';
import AdministrationWrapper from './administration/administration-wrapper';
import CustomizationTab from './customization/customization';

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="container flex items-center justify-between h-16 px-4">
                    <h1 className="text-lg font-bold sm:text-2xl whitespace-nowrap mr-4">
                        Paramètres
                    </h1>
                </div>
            </header>
            <div className="bg-muted/30 flex-grow">
                <div className="container py-6 px-4 md:py-10">
                    <Tabs defaultValue="account" className="space-y-6">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="account">
                                <User className="mr-2 h-4 w-4" />
                                Compte
                            </TabsTrigger>

                            <TabsTrigger value="customization">
                                <Palette className="mr-2 h-4 w-4" />
                                Customization
                            </TabsTrigger>

                            <TabsTrigger value="admin">
                                <Shield className="mr-2 h-4 w-4" />
                                Administration
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="account" className="space-y-6">
                            <AccountWrapper />
                        </TabsContent>

                        <TabsContent
                            value="customization"
                            className="space-y-6"
                        >
                            <CustomizationTab />
                        </TabsContent>

                        <TabsContent value="admin" className="space-y-6">
                            <AdministrationWrapper />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

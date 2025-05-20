'use client';

import { useState } from 'react';
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

export default function CustomizationTab() {
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#000000');

    const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des tags</CardTitle>
                <CardDescription>
                    Créez et gérez des tags personnalisés pour vos recettes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddTag} className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="tag-name">Nom du tag</Label>
                            <Input
                                id="tag-name"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Ex: italien, asiatique, etc."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tag-color">Couleur</Label>
                            <Input
                                type="color"
                                id="tag-color"
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Aperçu:</span>
                            new tag preview here
                        </div>
                        <Button type="submit">Ajouter un tag</Button>
                    </div>
                </form>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Tags personnalisés</h3>

                    {/* tags list here */}
                    {false ? (
                        ''
                    ) : (
                        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                            <p className="text-muted-foreground">
                                Aucun tag personnalisé
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

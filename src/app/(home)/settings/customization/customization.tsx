'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { Badge } from '@/components/ui/badge';
import { createTag } from '@/lib/api/tags';

export default function CustomizationTab() {
    const t = useTranslations('SettingsPage.CustomizationTab');
    const [newTagName, setNewTagName] = useState(t('form.defaultTagName'));
    const [newTagColor, setNewTagColor] = useState('#000000');

    const isComingSoon = true;

    const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createTag({
            name: newTagName,
            color: newTagColor,
            id: newTagName,
            type: 'user',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
                {isComingSoon ? (
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted/10">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                {t('comingSoon.title')}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                {t('comingSoon.description')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <form
                            onSubmit={handleAddTag}
                            className="mb-6 space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tag-name">
                                        {t('form.tagNameLabel')}
                                    </Label>
                                    <Input
                                        id="tag-name"
                                        value={newTagName}
                                        onChange={(e) =>
                                            setNewTagName(e.target.value)
                                        }
                                        placeholder={t(
                                            'form.tagNamePlaceholder'
                                        )}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tag-color">
                                        {t('form.colorLabel')}
                                    </Label>
                                    <Input
                                        type="color"
                                        id="tag-color"
                                        value={newTagColor}
                                        onChange={(e) =>
                                            setNewTagColor(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tag-icon">
                                        {t('form.previewLabel')}
                                    </Label>
                                    <div>
                                        <Badge
                                            size="lg"
                                            tag={{
                                                type: 'user',
                                                color: newTagColor,
                                                name: newTagName,
                                                id: newTagName,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <Button variant="coquo" type="submit">
                                        {t('form.createButton')}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">
                                {t('customTags.title')}
                            </h3>

                            <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                                <p className="text-muted-foreground">
                                    {t('customTags.empty')}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

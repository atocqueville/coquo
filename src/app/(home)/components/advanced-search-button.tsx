'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MultiTagSelect } from '@/components/ui/multi-tag-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Tag } from '@prisma/client';

interface AdvancedSearchButtonProps {
    selectedTags: string[];
    selectedUser: string;
    tags: Tag[];
    onTagsChange: (values: string[]) => void;
    onUserChange: (value: string) => void;
    onResetFilters: () => void;
    userOptions: Array<{ value: string; label: string }>;
}

export function AdvancedSearchButton({
    selectedTags,
    tags,
    userOptions,
    selectedUser,
    onTagsChange,
    onUserChange,
    onResetFilters,
}: AdvancedSearchButtonProps) {
    const t = useTranslations('HomePage.filters');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const hasActiveFilters = selectedTags.length > 0 || selectedUser !== '';

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="coquo-light"
                    data-state={
                        hasActiveFilters || isPopoverOpen ? 'active' : undefined
                    }
                    className="h-9 w-9 sm:px-4 sm:py-2 sm:w-auto relative"
                >
                    <span className="hidden sm:block">
                        {t('advancedSearch')}
                    </span>
                    <Filter className={hasActiveFilters ? 'text-white' : ''} />
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(206,85%,65%)] text-[10px] rounded-full flex items-center justify-center text-[hsl(210,90%,15%)] font-semibold">
                            {selectedTags.length + (selectedUser ? 1 : 0)}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                    <h3 className="font-medium text-base">{t('title')}</h3>

                    <div className="space-y-2">
                        <Label htmlFor="tags-filter">{t('tagsLabel')}</Label>
                        <MultiTagSelect
                            id="tags-filter"
                            options={tags.map((tag) => ({
                                value: tag.id,
                                tag,
                            }))}
                            onValueChange={onTagsChange}
                            defaultValue={selectedTags}
                            placeholder={t('tagsPlaceholder')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags-filter">{t('authorsLabel')}</Label>
                        <Select
                            value={selectedUser}
                            onValueChange={onUserChange}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t('authorsPlaceholder')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {userOptions.map((user) => (
                                    <SelectItem
                                        key={user.value}
                                        value={user.value}
                                    >
                                        {user.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                onResetFilters();
                                setIsPopoverOpen(false);
                            }}
                            className="mr-2"
                        >
                            {t('resetButton')}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

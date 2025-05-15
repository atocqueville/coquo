'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AdvancedSearchButtonProps {
    selectedTags: string[];
    selectedUser: string;
    tagOptions: Array<{ value: string; variant: string; label: string }>;
    onTagsChange: (values: string[]) => void;
    onUserChange: (value: string) => void;
    onResetFilters: () => void;
    userOptions: Array<{ value: string; label: string }>;
}

export function AdvancedSearchButton({
    selectedTags,
    tagOptions,
    userOptions,
    selectedUser,
    onTagsChange,
    onUserChange,
    onResetFilters,
}: AdvancedSearchButtonProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const hasActiveFilters = selectedTags.length > 0 || selectedUser !== '';

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`h-9 w-9 sm:px-4 sm:py-2 sm:w-auto ${
                        hasActiveFilters
                            ? 'bg-emerald-400 hover:bg-emerald-400/80 border-secondary text-primary relative'
                            : ''
                    }`}
                >
                    <span className="hidden sm:block">Recherche avancée</span>
                    <Filter
                        className={hasActiveFilters ? 'text-primary' : ''}
                    />
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] rounded-full flex items-center justify-center text-primary-foreground">
                            {selectedTags.length + (selectedUser ? 1 : 0)}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                    <h3 className="font-medium text-base">Filtres</h3>

                    <div className="space-y-2">
                        <Label htmlFor="tags-filter">Tags</Label>
                        <MultiSelect
                            id="tags-filter"
                            options={tagOptions}
                            onValueChange={onTagsChange}
                            defaultValue={selectedTags}
                            placeholder="Sélectionner des tags"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags-filter">Auteurs</Label>
                        <Select
                            value={selectedUser}
                            onValueChange={onUserChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Auteurs" />
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
                            Réinitialiser
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

import * as React from 'react';
import { CheckIcon, ChevronDown, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge, createSystemTagTranslator } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import type { Tag } from '@prisma/client';
import { useTranslations } from 'next-intl';
/**
 * Props for MultiTagSelect component
 */
interface MultiTagSelectProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * An array of option objects to be displayed in the multi-select component.
     * Each option object has a label, value, and an optional icon.
     */
    options: {
        value: string;
        tag: Tag;
    }[];

    /**
     * Callback function triggered when the selected values change.
     * Receives an array of the new selected values.
     */
    onValueChange: (value: string[]) => void;

    /** The default selected values when the component mounts. */
    defaultValue?: string[];

    /**
     * The modality of the popover. When set to true, interaction with outside elements
     * will be disabled and only popover content will be visible to screen readers.
     * Optional, defaults to false.
     */
    modalPopover?: boolean;

    /**
     * Additional class names to apply custom styles to the multi-select component.
     * Optional, can be used to add custom styles.
     */
    className?: string;
}

export const MultiTagSelect = React.forwardRef<
    HTMLButtonElement,
    MultiTagSelectProps
>(
    (
        {
            options,
            onValueChange,
            defaultValue = [],
            modalPopover = false,
            className,
            ...props
        },
        ref
    ) => {
        const t = useTranslations('common.SystemTags');
        const tMultiSelect = useTranslations('common.MultiTagSelect');
        const getTagLabel = createSystemTagTranslator(t);

        const [selectedValues, setSelectedValues] =
            React.useState<string[]>(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

        const defaultPlaceholder = tMultiSelect('placeholder');

        const toggleOption = (option: string) => {
            const newSelectedValues = selectedValues.includes(option)
                ? selectedValues.filter((value) => value !== option)
                : [...selectedValues, option];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto',
                            className
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-wrap items-center gap-1">
                                    {selectedValues.map((value) => {
                                        const option = options.find(
                                            (o) => o.value === value
                                        );
                                        return (
                                            <Badge
                                                key={value}
                                                tag={option?.tag}
                                                clickable
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    toggleOption(value);
                                                }}
                                                size="sm"
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-between">
                                    <XIcon
                                        className="h-4 mx-2 cursor-pointer text-muted-foreground"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleClear();
                                        }}
                                    />
                                    <Separator
                                        orientation="vertical"
                                        className="flex min-h-6 h-full"
                                    />
                                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full mx-auto">
                                <span className="text-sm text-muted-foreground mx-3">
                                    {defaultPlaceholder}
                                </span>
                                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = selectedValues.includes(
                                        option.value
                                    );
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() =>
                                                toggleOption(option.value)
                                            }
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'opacity-50 [&_svg]:invisible'
                                                )}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            <span>
                                                {getTagLabel(option?.tag)}
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }
);

MultiTagSelect.displayName = 'MultiTagSelect';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import tinycolor from 'tinycolor2';
import type { Tag } from '@prisma/client';

const i18nBadgeLabel = {
    vegetarian: 'Végétarien',
    meat: 'Viande',
    fish: 'Poisson',
    'gluten-free': 'Sans gluten',
    quick: 'Rapide',
    summer: 'Été',
    winter: 'Hiver',
    autumn: 'Automne',
    spring: 'Printemps',
    dessert: 'Dessert',
    starter: 'Entrée',
    main: 'Plat',
    spicy: 'Épicé',
};

export const getTagLabel = (tag: Tag) => {
    // Only translate tags of type 'system'
    if (tag.type === 'system') {
        return i18nBadgeLabel[tag.name as keyof typeof i18nBadgeLabel];
    }
    // For user tags or system tags without translation, return the name as is
    return tag.name;
};

const base =
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

const badgeVariants = cva(base, {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground',
            outline: 'text-foreground',
            coquo: 'border-[hsl(210,65%,40%)] bg-[hsl(210,65%,40%)] text-white',
            unselected: 'bg-muted text-muted-foreground border-gray-200',
        },
        size: {
            default: 'px-2.5 py-0.5 text-xs',
            sm: 'px-2 py-0.5 text-[10px]',
            lg: 'px-3 py-0.5 text-sm',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    clickable?: boolean;
    onCrossClick?: () => void;
    tag?: Tag;
}

function Badge({
    className,
    variant,
    size,
    children,
    clickable,
    tag,
    ...props
}: BadgeProps) {
    let style = {};
    let displayText = children;

    // If tag is provided, use it for the display text
    if (tag) {
        displayText = getTagLabel(tag);
        // Only apply tag styling if no explicit variant is provided
        if (!variant) {
            const base = tinycolor(tag.color);
            const bg = base.clone().setAlpha(0.15).toRgbString();
            const text = base.clone().darken(30).toHexString();
            const border = base.toHexString();
            style = {
                backgroundColor: bg,
                color: text,
                border: `1px solid ${border}`,
            };
        }
    }

    return (
        <div
            className={cn(
                badgeVariants({ variant, size }),
                className,
                'leading-none',
                'h-[22px]'
            )}
            style={style}
            {...props}
        >
            {displayText}
            {clickable && (
                <X className="ml-2 h-2 w-2 cursor-pointer text-[#8994b5] hover:text-[#001235]" />
            )}
        </div>
    );
}

export { Badge, badgeVariants };

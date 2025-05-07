import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground',
                outline: 'text-foreground',
                vegetarian: 'border-transparent bg-green-500 text-white',
                vegan: 'border-transparent bg-emerald-600 text-white',
                meat: 'border-transparent bg-red-500 text-white',
                fish: 'border-transparent bg-blue-500 text-white',
                'gluten-free': 'border-transparent bg-yellow-500 text-white',
                'dairy-free': 'border-transparent bg-purple-500 text-white',
                quick: 'border-transparent bg-orange-500 text-white',
                summer: 'border-transparent bg-amber-500 text-white',
                winter: 'border-transparent bg-sky-500 text-white',
                autumn: 'border-transparent bg-orange-700 text-white',
                spring: 'border-transparent bg-pink-500 text-white',
                dessert: 'border-transparent bg-rose-400 text-white',
                breakfast: 'border-transparent bg-indigo-500 text-white',
                lunch: 'border-transparent bg-cyan-500 text-white',
                dinner: 'border-transparent bg-violet-500 text-white',
                snack: 'border-transparent bg-lime-500 text-white',
                spicy: 'border-transparent bg-red-600 text-white',
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
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export const badgeLabel = {
    vegetarian: 'Végétarien',
    vegan: 'Végan',
    meat: 'Viande',
    fish: 'Poisson',
    'gluten-free': 'Sans gluten',
    'dairy-free': 'Sans lactose',
    quick: 'Rapide',
    summer: 'Été',
    winter: 'Hiver',
    autumn: 'Automne',
    spring: 'Printemps',
    dessert: 'Dessert',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    spicy: 'Épicé',
};

const badgeVariants = cva(
    'inline-flex text-black items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground',
                outline: 'text-foreground',
                vegetarian: 'border-[#8fdcb7] bg-[#eafded] text-[#015250]',
                vegan: 'border-[#b3e194] bg-[#ecfbd6] text-[#0f5909]',
                meat: 'border-[#fcada8] bg-[#fef0ed] text-[#6c0745]',
                fish: 'border-[#93dde1] bg-[#ebfdf9] text-[#02355b]',
                'gluten-free': 'border-teal-400 bg-teal-100 text-teal-900',
                'dairy-free': 'border-blue-400 bg-blue-100 text-blue-900',
                quick: 'border-orange-400 bg-orange-100 text-orange-900',
                summer: 'border-[#ffdb66] bg-[#fffbeb] text-[#7a4700]',
                winter: 'border-[#96c1fb] bg-[#eaf3fe] text-[#001368]',
                autumn: 'border-[#ffc382] bg-[#fff2e4] text-[#712602]',
                spring: 'border-[#f9c9f5] bg-[#fef4fc] text-[#3d1360]',
                dessert: 'border-[#f6b0ca] bg-[#feeff5] text-[#6c0d58]',
                lunch: 'border-pink-400 bg-pink-100 text-pink-900',
                dinner: 'border-violet-400 bg-violet-100 text-violet-900',
                spicy: 'border-red-400 bg-red-200 text-red-800',
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
        VariantProps<typeof badgeVariants> {
    clickable?: boolean;
    onCrossClick?: () => void;
}

function Badge({
    className,
    variant,
    size,
    children,
    clickable,
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(
                badgeVariants({ variant, size }),
                className,
                'leading-none',
                'h-[22px]'
            )}
            {...props}
        >
            {badgeLabel[variant as keyof typeof badgeLabel] ?? children}
            {clickable && (
                <X className="ml-2 h-2 w-2 cursor-pointer text-[#8994b5] hover:text-[#001235]" />
            )}
        </div>
    );
}

export { Badge, badgeVariants };

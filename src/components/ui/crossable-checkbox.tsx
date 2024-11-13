'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';

const CrossableCheckbox = React.forwardRef<
    React.ElementRef<typeof Checkbox>,
    React.ComponentPropsWithoutRef<typeof Checkbox>
>(({ className, ...props }, ref) => (
    <div className="flex items-center my-2">
        <Checkbox
            ref={ref}
            className={cn(
                'peer h-5 w-5 shrink-0 rounded-none border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#2383e2] data-[state=checked]:border-[#2383e2] data-[state=checked]:text-primary-foreground',
                className
            )}
            {...props}
        ></Checkbox>
        <label
            htmlFor={props.id}
            className="
                    text-lg font-medium cursor-pointer select-none leading-none pl-2
                    decoration-[#37352f3f]
                    peer-data-[state=checked]:line-through
                    peer-data-[state=checked]:opacity-70
                    peer-data-[state=checked]:text-[#37352fa5]
                    peer-disabled:cursor-not-allowed
                    peer-disabled:opacity-70"
        >
            {props.children}
        </label>
    </div>
));
CrossableCheckbox.displayName = 'CrossableCheckbox';

export { CrossableCheckbox };

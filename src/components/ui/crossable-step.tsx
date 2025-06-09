'use client';

import * as React from 'react';
import { CrossableCheckbox } from './crossable-checkbox';

interface CrossableStepProps {
    id: string;
    title: string;
    instructions: string[];
    className?: string;
}

export function CrossableStep({
    id,
    title,
    instructions,
    className,
}: CrossableStepProps) {
    const [checked, setChecked] = React.useState(false);
    const [instructionStates, setInstructionStates] = React.useState<boolean[]>(
        new Array(instructions.length).fill(false)
    );

    const handleStepCheck = (checked: boolean) => {
        setChecked(checked);
        setInstructionStates(new Array(instructions.length).fill(checked));
    };

    const handleInstructionCheck = (
        index: number,
        checked: boolean | 'indeterminate'
    ) => {
        if (checked === 'indeterminate') return;

        const newStates = [...instructionStates];
        newStates[index] = checked;
        setInstructionStates(newStates);

        // If all instructions are checked, check the step
        if (newStates.every((state) => state)) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    };

    return (
        <div className={`${className} print:break-inside-avoid`}>
            <CrossableCheckbox
                id={`step-${id}`}
                checked={checked}
                classNameLabel="font-bold print:text-xl print:mb-2"
                onCheckedChange={handleStepCheck}
            >
                {title}
            </CrossableCheckbox>
            <ol className="mt-4 space-y-4 print:mt-2 print:space-y-2 print:list-decimal print:list-inside print:pl-4">
                {instructions.map((instruction, idx) => (
                    <li key={idx} className="print:list-item">
                        <div className="flex gap-4 print:block">
                            <CrossableCheckbox
                                id={`instruction-${id}-${idx}`}
                                checked={instructionStates[idx]}
                                onCheckedChange={(checked) =>
                                    handleInstructionCheck(idx, checked)
                                }
                                classNameLabel="print:text-base print:font-normal"
                            >
                                {instruction}
                            </CrossableCheckbox>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

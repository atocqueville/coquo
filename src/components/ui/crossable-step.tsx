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
        <div className={className}>
            <CrossableCheckbox
                id={`step-${id}`}
                checked={checked}
                onCheckedChange={handleStepCheck}
            >
                {title}
            </CrossableCheckbox>
            <ol className="mt-4 space-y-4 pl-5">
                {instructions.map((instruction, idx) => (
                    <li key={idx} className="pl-2">
                        <div className="flex gap-4">
                            <CrossableCheckbox
                                id={`instruction-${id}-${idx}`}
                                checked={instructionStates[idx]}
                                onCheckedChange={(checked) =>
                                    handleInstructionCheck(idx, checked)
                                }
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

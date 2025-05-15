'use client';

import React, { useState } from 'react';
import { useWakeLock } from 'react-screen-wake-lock';
import { Switch } from '@/components/ui/switch';

export default function KeepScreenAwake() {
    const [checked, setChecked] = useState(false);

    const { isSupported, request, release } = useWakeLock({
        onRequest: () => {
            setChecked(true);
        },
        onError: () => {},
        onRelease: () => {
            setChecked(false);
        },
        reacquireOnPageVisible: true,
    });

    function handleChange(value: boolean) {
        setChecked(value);
        if (value) request();
        else release();
    }

    return (
        <Switch
            disabled={!isSupported}
            checked={checked}
            onCheckedChange={handleChange}
        />
    );
}

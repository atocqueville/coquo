'use client';

import dynamic from 'next/dynamic';

const DynamicWakeLock = dynamic(() => import('./keep-screen-awake'), {
    ssr: false,
});

export default function Wrapper() {
    return <DynamicWakeLock />;
}

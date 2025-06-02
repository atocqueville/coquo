import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    // Initialize with the correct value if window is available, otherwise false
    const [isMobile, setIsMobile] = React.useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < MOBILE_BREAKPOINT;
        }
        return false;
    });

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener('change', onChange);
        // Set the initial value - this might be redundant now but ensures accuracy
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return isMobile;
}

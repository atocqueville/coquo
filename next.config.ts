import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        scrollRestoration: true,
        serverActions: {
            bodySizeLimit: '12mb',
        },
    },
    headers: async () => [
        {
            source: '/(.*)',
            headers: [
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                //   {
                //     key: 'Referrer-Policy',
                //     value: 'strict-origin-when-cross-origin',
                //   },
            ],
        },
        {
            source: '/sw.js',
            headers: [
                {
                    key: 'Content-Type',
                    value: 'application/javascript; charset=utf-8',
                },
                {
                    key: 'Cache-Control',
                    value: 'no-cache, no-store, must-revalidate',
                },
                {
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self'",
                },
            ],
        },
    ],
};

export default withNextIntl(nextConfig);

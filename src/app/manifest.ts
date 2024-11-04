import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Coquo',
        short_name: 'Coquo',
        description: 'Cook. Create. Collect.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/logo_192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/logo_512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}

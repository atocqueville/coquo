import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Coquo',
        short_name: 'Coquo',
        description: 'Cook. Create. Collect.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2466a8',
        icons: [
            {
                src: '/blue-banana_192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/blue-banana_512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/blue-banana_1024.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
        ],
    };
}

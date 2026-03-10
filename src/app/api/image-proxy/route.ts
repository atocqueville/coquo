import { FILE_STORAGE_URL } from '@/lib/api/express.constants';

const IMAGE_MIME: Record<string, string> = {
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
};

function getContentType(imageId: string | null): string {
    if (!imageId) return 'application/octet-stream';
    const ext = imageId.slice(imageId.lastIndexOf('.')).toLowerCase();
    return IMAGE_MIME[ext] ?? 'application/octet-stream';
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
        return new Response('Missing imageId', { status: 400 });
    }

    const imageUrl = `${FILE_STORAGE_URL}/media/${imageId}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
        return new Response('Image not found', { status: 404 });
    }

    const contentType =
        response.headers.get('Content-Type')?.startsWith('image/')
            ? response.headers.get('Content-Type')!
            : getContentType(imageId);

    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}

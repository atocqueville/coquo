import { FILE_STORAGE_URL } from '@/lib/api/express.constants';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    // Construire l'URL de l'image sur le serveur Express
    const imageUrl = `${FILE_STORAGE_URL}/media/${imageId}`;

    // Faire la requête vers le serveur Express
    const response = await fetch(imageUrl);

    if (!response.ok) {
        return new Response('Image not found', { status: 404 });
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.startsWith('image')) {
        return new Response("The requested resource isn't a valid image", {
            status: 400,
        });
    }

    // Renvoyer l'image sous forme de flux (stream)
    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
        headers: { 'Content-Type': contentType },
    });
}

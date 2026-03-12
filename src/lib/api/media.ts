'use server';

import { MEDIA_BASE_URL, MEDIA_PATH } from './express.constants';

export async function uploadImages(
    fileList: File[]
): Promise<{ paths: string[] }> {
    if (!fileList || fileList.length === 0) {
        throw new Error('No files provided');
    }

    const formData = new FormData();
    fileList.forEach((file) => {
        formData.append('files', file);
    });

    const uploadUrl = `${MEDIA_BASE_URL}${MEDIA_PATH}/files`;

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', response.status, errorText);
            throw new Error(
                `Upload failed: ${response.status} ${response.statusText}`
            );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(
                'Server returned non-JSON response. Make sure the app is running.'
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
}

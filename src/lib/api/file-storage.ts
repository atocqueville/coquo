'use server';

import { FILE_STORAGE_URL } from './express.constants';

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

    try {
        const response = await fetch(FILE_STORAGE_URL + '/files', {
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
            const responseText = await response.text();
            console.error(
                'Expected JSON response but got:',
                contentType,
                responseText
            );
            throw new Error(
                'Server returned non-JSON response. Make sure the file storage server is running on port 3040.'
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
}

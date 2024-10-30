'use server';

import { FILE_STORAGE_URL } from './express.constants';

export async function uploadImage(
    fileList: FileList
): Promise<{ path: string }> {
    if (!fileList[0]) {
        throw new Error('No file provided');
    }
    const formData = new FormData();
    formData.append('file', fileList[0] as File);

    return fetch(FILE_STORAGE_URL + '/file', {
        method: 'POST',
        body: formData,
    }).then((response) => response.json());
}

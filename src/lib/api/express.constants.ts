/** Base URL for media (upload + static). Same origin when using custom server. */
export const MEDIA_BASE_URL =
    process.env.MEDIA_URL ||
    process.env.FILE_STORAGE_URL ||
    `http://127.0.0.1:${process.env.PORT || 3847}`;

/** Base path for media routes on the custom server */
export const MEDIA_PATH = '/media';

/** URL path for a media file (use with next/image, same origin). */
export const getMediaPath = (filename: string) =>
    `${MEDIA_PATH}/${filename}`;

/**
 * Retrieves the AUTH_SECRET.
 * - Dev : fixed secret (stable sessions between restarts).
 * - Prod : AUTH_SECRET is required (environment variable).
 */
export function getAuthSecret(): string {
    if (process.env.AUTH_SECRET) {
        return process.env.AUTH_SECRET;
    }

    if (process.env.NODE_ENV === 'development') {
        return 'dev-secret-do-not-use-in-production';
    }

    throw new Error(
        'AUTH_SECRET is required in production. Set it in your environment (e.g. docker compose). For a local prod build, use: AUTH_SECRET=build-placeholder yarn build:prod'
    );
}

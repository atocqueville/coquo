/**
 * Retrieves the BETTER_AUTH_SECRET.
 * - Dev : fixed secret (stable sessions between restarts).
 * - Prod : BETTER_AUTH_SECRET is required (environment variable).
 */
export function getAuthSecret(): string {
    if (process.env.BETTER_AUTH_SECRET) {
        return process.env.BETTER_AUTH_SECRET;
    }

    if (process.env.NODE_ENV === 'development') {
        return 'dev-secret-do-not-use-in-production';
    }

    throw new Error(
        'BETTER_AUTH_SECRET is required in production. Set it in your environment (e.g. docker compose). For a local prod build, use: BETTER_AUTH_SECRET=build-placeholder yarn build:prod'
    );
}

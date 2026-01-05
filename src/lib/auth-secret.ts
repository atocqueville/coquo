import { randomBytes } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const SECRET_FILE_PATH = '/config/auth-secret.txt';
const SECRET_LENGTH = 32; // 256 bits

/**
 * Gets or generates the BETTER_AUTH_SECRET
 * - Dev: uses env var or generates a temporary secret
 * - Prod (Docker): persists the secret in /config/auth-secret.txt
 */
export function getAuthSecret(): string {
    // If env var is set, use it
    if (process.env.BETTER_AUTH_SECRET) {
        return process.env.BETTER_AUTH_SECRET;
    }

    // In development, use a fixed secret for better DX (sessions persist across restarts)
    if (process.env.NODE_ENV === 'development') {
        return 'dev-secret-do-not-use-in-production';
    }

    // In production, use persisted file
    try {
        if (existsSync(SECRET_FILE_PATH)) {
            const secret = readFileSync(SECRET_FILE_PATH, 'utf-8').trim();
            if (secret.length >= 32) {
                console.log(
                    '[Auth] Using persisted secret from',
                    SECRET_FILE_PATH
                );
                return secret;
            }
        }

        // Generate and save a new secret
        const newSecret = randomBytes(SECRET_LENGTH).toString('base64');

        // Create directory if needed
        const dir = dirname(SECRET_FILE_PATH);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        writeFileSync(SECRET_FILE_PATH, newSecret, { mode: 0o600 });
        console.log(
            '[Auth] Generated and saved new secret to',
            SECRET_FILE_PATH
        );

        return newSecret;
    } catch (error) {
        console.error('[Auth] Failed to read/write secret file:', error);
        throw new Error(
            'Cannot initialize auth secret. Ensure /config is writable or set BETTER_AUTH_SECRET env var.'
        );
    }
}

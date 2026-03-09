export function getGoogleCredentials():
    | { clientId: string; clientSecret: string }
    | null {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (clientId && clientSecret) {
        return { clientId, clientSecret };
    }
    return null;
}

export function isGoogleAuthEnabled(): boolean {
    return getGoogleCredentials() !== null;
}

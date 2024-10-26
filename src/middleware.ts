import { type MiddlewareConfig } from 'next/server';

export { auth as middleware } from '@/auth';

export const config: MiddlewareConfig = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};

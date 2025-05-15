import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isHomePage = nextUrl.pathname === '/';

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return;
    }

    // If authenticated and navigating to homepage, add filters from cookie to searchParams
    if (isLoggedIn && isHomePage && !nextUrl.search) {
        try {
            // Access cookies directly from the request
            const cookieHeader = req.cookies.get('recipeFilters')?.value;

            if (cookieHeader) {
                const recipeFilters = JSON.parse(cookieHeader);
                const tags = recipeFilters.tags;
                const q = recipeFilters.q;
                if ((tags && tags.length > 0) || q) {
                    const url = new URL(nextUrl.href);
                    url.searchParams.set('tags', tags.join(','));
                    url.searchParams.set('q', q);
                    return Response.redirect(url);
                }
            }
        } catch (error) {
            console.error('Error applying filters from cookie:', error);
        }
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(
            new URL(
                `/api/auth/login?callbackUrl=${encodedCallbackUrl}`,
                nextUrl
            )
        );
    }

    return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

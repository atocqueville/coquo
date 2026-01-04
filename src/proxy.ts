import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from '@/routes';

export async function proxy(request: NextRequest) {
    const { nextUrl } = request;

    // Get session cookie (Edge-compatible, no DB call)
    // Note: This only checks if a cookie exists, not if it's valid
    // Full validation (emailVerified, role) happens in Server Components
    const sessionCookie = getSessionCookie(request);
    const isLoggedIn = !!sessionCookie;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isHomePage = nextUrl.pathname === '/';

    // Allow API auth routes to pass through
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from auth routes
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
            );
        }
        return NextResponse.next();
    }

    // If authenticated and navigating to homepage, add filters from cookie to searchParams
    if (isLoggedIn && isHomePage && !nextUrl.search) {
        try {
            const cookieHeader = request.cookies.get('recipeFilters')?.value;
            if (cookieHeader) {
                const recipeFilters = JSON.parse(cookieHeader);
                const tags = recipeFilters.tags;
                const q = recipeFilters.q;
                const user = recipeFilters.user;
                if ((tags && tags.length > 0) || q || user) {
                    const url = new URL(nextUrl.href);
                    url.searchParams.set('tags', tags.join(','));
                    url.searchParams.set('q', q);
                    url.searchParams.set('user', user);
                    return NextResponse.redirect(url);
                }
            }
        } catch (error) {
            console.error('Error applying filters from cookie:', error);
        }
    }

    // Redirect unauthenticated users to login
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return NextResponse.next();
}

// Optionally, don't invoke proxy on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

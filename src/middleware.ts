import NextAuth from 'next-auth';
import { getToken } from 'next-auth/jwt';

import authConfig from '@/auth.config';
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // For more reliable email verification check, get the token directly
    // This is necessary because middleware doesn't always have access to the full session user
    let isEmailVerified = !!req.auth?.user?.emailVerified;

    // If we couldn't get it from the session user, try getting it from the token
    if (isLoggedIn && !isEmailVerified) {
        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            secureCookie: nextUrl.protocol === 'https:',
        });
        isEmailVerified = !!token?.emailVerified || token?.role === 'ADMIN';
    }

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

    // If user is logged in but email is not verified, redirect to error page
    if (isLoggedIn && !isEmailVerified && !isPublicRoute) {
        return Response.redirect(new URL('/auth/error', nextUrl));
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
                const user = recipeFilters.user;
                if ((tags && tags.length > 0) || q || user) {
                    const url = new URL(nextUrl.href);
                    url.searchParams.set('tags', tags.join(','));
                    url.searchParams.set('q', q);
                    url.searchParams.set('user', user);
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
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

import { FileText, Heart, Home, PlusCircle, Settings } from 'lucide-react';

/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/auth/new-verification', '/auth/error'];

export const appRoutes = [
    {
        href: '/',
        icon: Home,
        label: 'Accueil',
    },
    {
        href: '/favorite',
        icon: Heart,
        label: 'Favoris',
    },
    {
        href: '/create',
        icon: PlusCircle,
        label: 'Nouvelle recette',
    },
    {
        href: '/changelog',
        icon: FileText,
        label: 'Changelog',
    },
    {
        href: '/settings',
        icon: Settings,
        label: 'Paramètres',
    },
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    // '/auth/reset',
    // '/auth/new-password',
];

/**
 * The prefix for api authentication routes.
 * Routes that starts with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';

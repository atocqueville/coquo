import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { getUserById } from '@/lib/api/user';

// Supported locales
const locales = ['fr', 'en'];
const defaultLocale = 'en';

export default getRequestConfig(async () => {
    let locale = defaultLocale;

    try {
        // Get browser language preference
        const headersList = await headers();
        const acceptLanguage = headersList.get('accept-language');
        let browserLocale: string | null = null;

        if (acceptLanguage) {
            const extractedLocale = acceptLanguage.split(',')[0].split('-')[0];

            if (locales.includes(extractedLocale)) {
                browserLocale = extractedLocale;
            }
        }

        // Try to get user's preferred locale from session
        const session = await auth();
        if (session?.user?.id) {
            const user = await getUserById(session.user.id);
            if (user?.locale && locales.includes(user.locale)) {
                // User has a preference, use it
                locale = user.locale;
            } else if (browserLocale) {
                // No user preference, fallback to browser language
                locale = browserLocale;
            }
        } else if (browserLocale) {
            // No user session, use browser language
            locale = browserLocale;
        }
    } catch (error) {
        // Fallback to default locale if anything fails
        console.error('Error determining locale:', error);
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});

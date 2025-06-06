import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import { getLocale } from 'next-intl/server';
import './globals.css';

const geistSans = localFont({
    src: '../fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: '../fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Coquo',
    description: 'Cook. Create. Collect.',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextIntlClientProvider>
                    {children}
                    <Toaster richColors />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

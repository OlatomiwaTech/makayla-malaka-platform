import type { Metadata } from 'next';

import './globals.css';

import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'),
  ),
  title: {
    default: 'Makayla Malaka | Official Website',
    template: '%s | Makayla Malaka',
  },
  description:
    'Discover official music releases, videos, news, events, and updates from artist Makayla Malaka.',
  applicationName: 'Makayla Malaka',
  authors: [{ name: 'Makayla Malaka' }],
  creator: 'Makayla Malaka',
  publisher: 'Makayla Malaka',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Makayla Malaka',
    title: 'Makayla Malaka | Official Website',
    description:
      'Discover official music releases, videos, news, events, and updates from artist Makayla Malaka.',
    url: '/',
    locale: 'en_GB',
    images: [{ url: '/Logo.png', width: 512, height: 512, alt: 'Makayla Malaka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Makayla Malaka | Official Website',
    description:
      'Discover official music releases, videos, news, events, and updates from artist Makayla Malaka.',
    images: ['/Logo.png'],
  },
  robots: {
    index: process.env.VERCEL_ENV !== 'preview',
    follow: process.env.VERCEL_ENV !== 'preview',
    googleBot: {
      index: process.env.VERCEL_ENV !== 'preview',
      follow: process.env.VERCEL_ENV !== 'preview',
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

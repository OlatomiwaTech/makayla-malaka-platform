import type { Metadata } from 'next';

import { canonicalUrl, jsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Music catalogue',
  description: 'Explore official singles, EPs, albums, tracklists, and streaming links from Makayla Malaka.',
  alternates: { canonical: '/music' },
  openGraph: {
    type: 'website',
    title: 'Music catalogue',
    description: 'Explore official singles, EPs, albums, tracklists, and streaming links from Makayla Malaka.',
    url: '/music',
  },
};

export default function MusicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Makayla Malaka music catalogue',
    description: 'Official music releases from Makayla Malaka.',
    url: canonicalUrl('/music'),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      {children}
    </>
  );
}

import type { Metadata } from 'next';

import { canonicalUrl, jsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Official videos',
  description: 'Watch official music videos, performances, REFIXES, interviews, and behind-the-scenes videos from Makayla Malaka.',
  alternates: { canonical: '/videos' },
  openGraph: {
    type: 'website',
    title: 'Official videos',
    description: 'Watch official music videos, performances, REFIXES, interviews, and behind-the-scenes videos from Makayla Malaka.',
    url: '/videos',
  },
};

export default function VideosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Makayla Malaka official videos',
    description: 'Official video catalogue from Makayla Malaka.',
    url: canonicalUrl('/videos'),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      {children}
    </>
  );
}

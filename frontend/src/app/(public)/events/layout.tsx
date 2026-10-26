import type { Metadata } from 'next';
import { canonicalUrl, jsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Find Makayla Malaka’s live appearances and event announcements.',
  alternates: { canonical: '/events' },
  openGraph: { type: 'website', title: 'Events', description: 'Find Makayla Malaka’s live appearances and event announcements.', url: '/events' },
};

export default function EventsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Makayla Malaka events', description: 'Upcoming and past public events from Makayla Malaka.', url: canonicalUrl('/events') })} />{children}</>;
}

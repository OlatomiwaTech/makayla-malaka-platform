import type { Metadata } from 'next';
import EventDetailClient from './event-detail-client';
import { canonicalUrl, descriptionForSeo, getPublicEventForSeo, jsonLd } from '@/lib/seo';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getPublicEventForSeo(id);
  if (!event) return { title: 'Event', description: 'Event details from Makayla Malaka.', robots: { index: false, follow: false }, alternates: { canonical: canonicalUrl(`/events/${id}`) } };
  const description = descriptionForSeo(event.description, `${event.title} — ${new Date(event.startsAt).toLocaleString()}`);
  const url = canonicalUrl(`/events/${event.id}`);
  return { title: event.title, description, alternates: { canonical: url }, openGraph: { type: 'website', title: event.title, description, url, images: event.imageUrl ? [{ url: event.imageUrl, alt: event.title }] : [] }, twitter: { card: 'summary_large_image', title: event.title, description, ...(event.imageUrl ? { images: [event.imageUrl] } : {}) } };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await getPublicEventForSeo(id);
  const structuredData = event ? { '@context': 'https://schema.org', '@type': 'Event', name: event.title, description: descriptionForSeo(event.description, event.title), startDate: event.startsAt, ...(event.endsAt ? { endDate: event.endsAt } : {}), ...(event.location ? { location: { '@type': 'Place', name: event.location } } : {}), ...(event.imageUrl ? { image: [event.imageUrl] } : {}), ...(event.registrationUrl ? { offers: { '@type': 'Offer', url: event.registrationUrl } } : {}), eventStatus: event.status === 'CANCELLED' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled', url: canonicalUrl(`/events/${event.id}`) } : null;
  return <>{structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />}<EventDetailClient id={id} initialEvent={event ?? undefined} /></>;
}

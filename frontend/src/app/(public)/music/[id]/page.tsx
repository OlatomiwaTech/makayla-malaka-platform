import type { Metadata } from 'next';

import MusicDetailClient from './music-detail-client';
import {
  canonicalUrl,
  descriptionForSeo,
  getPublicReleaseForSeo,
  isoDuration,
  jsonLd,
} from '@/lib/seo';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const release = await getPublicReleaseForSeo(id);

  if (!release) {
    return {
      title: 'Music release',
      description: 'Explore official music releases from Makayla Malaka.',
      robots: { index: false, follow: false },
      alternates: { canonical: canonicalUrl(`/music/${id}`) },
    };
  }

  const title = release.seoTitle?.trim() || `${release.title} by ${release.artistName}`;
  const description = descriptionForSeo(
    release.seoDescription,
    release.description || `Listen to ${release.title} by ${release.artistName}. Explore the tracklist and official streaming links.`,
  );
  const url = canonicalUrl(`/music/${release.id}`);
  const image = release.coverUrl || '/Logo.png';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Makayla Malaka',
      images: [{ url: image, alt: `${release.title} cover artwork` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function MusicReleasePage({ params }: Props) {
  const { id } = await params;
  const release = await getPublicReleaseForSeo(id);
  const structuredData = release
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicAlbum',
        name: release.title,
        byArtist: {
          '@type': 'Person',
          name: release.artistName,
        },
        datePublished: release.releaseDate,
        numTracks: release.tracks.length,
        ...(release.coverUrl ? { image: release.coverUrl } : {}),
        ...(release.description ? { description: release.description } : {}),
        ...(release.links.length
          ? { sameAs: release.links.map((link) => link.url) }
          : {}),
        track: {
          '@type': 'ItemList',
          numberOfItems: release.tracks.length,
          itemListElement: release.tracks.map((track) => ({
            '@type': 'MusicRecording',
            position: track.trackNumber,
            name: track.title,
            ...(track.durationSeconds
              ? { duration: isoDuration(track.durationSeconds) }
              : {}),
          })),
        },
        url: canonicalUrl(`/music/${release.id}`),
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(structuredData)}
        />
      )}
      <MusicDetailClient id={id} initialRelease={release ?? undefined} />
    </>
  );
}

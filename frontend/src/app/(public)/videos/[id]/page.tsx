import type { Metadata } from 'next';

import VideoDetailClient from './video-detail-client';
import {
  canonicalUrl,
  descriptionForSeo,
  getPublicVideoForSeo,
  isoDuration,
  jsonLd,
} from '@/lib/seo';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await getPublicVideoForSeo(id);

  if (!video) {
    return {
      title: 'Video',
      description: 'Watch official videos from Makayla Malaka.',
      robots: { index: false, follow: false },
      alternates: { canonical: canonicalUrl(`/videos/${id}`) },
    };
  }

  const title = video.seoTitle?.trim() || video.title;
  const description = descriptionForSeo(
    video.seoDescription,
    video.description || `Watch ${video.title} by Makayla Malaka.`,
  );
  const url = canonicalUrl(`/videos/${video.id}`);
  const image = video.thumbnailUrl || '/Logo.png';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'video.other',
      url,
      title,
      description,
      siteName: 'Makayla Malaka',
      images: [{ url: image, alt: `${video.title} video thumbnail` }],
      videos: [{ url: `https://www.youtube.com/embed/${video.youtubeVideoId}` }],
    },
    twitter: {
      card: 'player',
      title,
      description,
      images: [image],
      players: {
        playerUrl: `https://www.youtube.com/embed/${video.youtubeVideoId}`,
        width: 1280,
        height: 720,
      },
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  const video = await getPublicVideoForSeo(id);
  const structuredData = video
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: descriptionForSeo(video.description, `Watch ${video.title} by Makayla Malaka.`),
        thumbnailUrl: video.thumbnailUrl
          ? [video.thumbnailUrl]
          : [`https://i.ytimg.com/vi/${video.youtubeVideoId}/hqdefault.jpg`],
        embedUrl: `https://www.youtube.com/embed/${video.youtubeVideoId}`,
        ...(video.sourcePublishedAt || video.publishedAt
          ? { uploadDate: video.sourcePublishedAt || video.publishedAt }
          : {}),
        ...(video.durationSeconds
          ? { duration: isoDuration(video.durationSeconds) }
          : {}),
        ...(video.channelTitle
          ? { publisher: { '@type': 'Organization', name: video.channelTitle } }
          : {}),
        url: canonicalUrl(`/videos/${video.id}`),
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
      <VideoDetailClient id={id} initialVideo={video ?? undefined} />
    </>
  );
}

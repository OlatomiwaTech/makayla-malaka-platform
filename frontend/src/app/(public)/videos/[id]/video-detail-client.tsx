'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { YouTubePlayer } from '@/components/videos/youtube-player';

import type { Video } from '@/types/video';

type VideoResponse = {
  success: boolean;
  data: {
    video: Video;
  };
};

export default function VideoDetailClient({
  id,
  initialVideo,
}: {
  id: string;
  initialVideo?: Video;
}) {

  const query = useQuery({
    queryKey: ['video-detail', id],
    queryFn: () => api<VideoResponse>(`/videos/${id}`),
    ...(initialVideo
      ? {
          initialData: {
            success: true,
            data: { video: initialVideo },
          },
          staleTime: 5 * 60 * 1000,
        }
      : {}),
  });

  if (query.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="aspect-video animate-pulse rounded-[30px] bg-black/5" />
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Video not found
        </h1>

        <Link
          href="/videos"
          className="mt-4 inline-block text-sm font-medium"
        >
          Back to videos
        </Link>
      </main>
    );
  }

  const video = query.data.data.video;

  return (
    <div className="bg-[#f7f5f1]">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to videos
        </Link>

        <div className="mt-8">
          <YouTubePlayer
            videoId={video.youtubeVideoId}
            title={video.title}
          />
        </div>

        <div className="mt-8 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
            {video.category}
            {video.channelTitle ? ` · ${video.channelTitle}` : ''}
            {video.durationSeconds !== null
              ? ` · ${Math.floor(video.durationSeconds / 60)}:${String(video.durationSeconds % 60).padStart(2, '0')}`
              : ''}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            {video.title}
          </h1>

          {video.sourcePublishedAt && (
            <p className="mt-3 text-sm text-black/45">
              Published on YouTube {new Date(video.sourcePublishedAt).toLocaleDateString()}
            </p>
          )}

          {video.description && (
            <p className="mt-5 text-base leading-7 text-black/55">
              {video.description}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

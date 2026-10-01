'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

import { api } from '@/lib/api';
import type { MusicRelease } from '@/types/music';

type ReleaseResponse = {
  success: boolean;
  data: {
    release: MusicRelease;
  };
};

type ReleasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ReleasePage({
  params,
}: ReleasePageProps) {
  const { id } = use(params);

  const query = useQuery({
    queryKey: ['music-release', id],
    queryFn: () => api<ReleaseResponse>(`/music/${id}`),
  });

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="h-96 animate-pulse rounded-[30px] bg-black/5" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Release not found
        </h1>

        <Link
          href="/music"
          className="mt-4 inline-block text-sm font-medium"
        >
          Back to music
        </Link>
      </div>
    );
  }

  const release = query.data.data.release;

  return (
    <div className="bg-[#f7f5f1]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/music"
          className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to music
        </Link>

        <section className="mt-8 grid overflow-hidden rounded-[32px] bg-[#171717] text-white lg:grid-cols-[0.85fr_1.15fr]">
          <div className="aspect-square bg-[#252525]">
            {release.coverUrl ? (
              <img
                src={release.coverUrl}
                alt={`${release.title} cover`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full min-h-[400px] place-items-center">
                <span className="text-9xl font-semibold text-white/10">
                  M
                </span>
              </div>
            )}
          </div>

          <div className="p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              {release.type} ·{' '}
              {new Date(
                release.releaseDate,
              ).getFullYear()}
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
              {release.title}
            </h1>

            {release.description && (
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                {release.description}
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-2">
              {release.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
                >
                  {link.platform}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">
            Tracklist
          </h2>

          <div className="mt-5 overflow-hidden rounded-[26px] border border-black/[0.07] bg-white">
            {release.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 border-b border-black/[0.06] px-5 py-5 last:border-b-0 sm:px-6"
              >
                <span className="w-6 text-sm text-black/30">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {track.title}
                  </p>
                </div>

                {track.durationSeconds && (
                  <span className="text-sm tabular-nums text-black/35">
                    {Math.floor(track.durationSeconds / 60)}:
                    {String(track.durationSeconds % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

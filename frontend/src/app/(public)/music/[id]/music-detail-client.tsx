'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Music2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { MusicRelease } from '@/types/music';

type ReleaseResponse = {
  success: boolean;
  data: {
    release: MusicRelease;
  };
};

export default function MusicDetailClient({
  id,
  initialRelease,
}: {
  id: string;
  initialRelease?: MusicRelease;
}) {

  const query = useQuery({
    queryKey: ['music-release', id],
    queryFn: () => api<ReleaseResponse>(`/music/${id}`),
    ...(initialRelease
      ? {
          initialData: {
            success: true,
            data: { release: initialRelease },
          },
          staleTime: 5 * 60 * 1000,
        }
      : {}),
  });

  const release = query.data?.data.release;

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14" aria-label="Loading music release" aria-busy="true">
        <div className="h-96 animate-pulse rounded-[30px] bg-black/5" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center" role="alert">
        <Music2 className="mx-auto text-[#8d344b]" size={30} aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl text-[#542c28]">
          {query.isError ? 'This release is unavailable' : 'Release not found'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#654b44]/65">
          {query.isError
            ? 'We couldn’t load this release right now. Please try again or return to the music catalogue.'
            : 'This release may have been removed or is not publicly available.'}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {query.isError && (
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="min-h-11 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d344b]"
            >
              Try again
            </button>
          )}
          <Link
            href="/music"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8b4a35]/20 bg-white px-5 py-3 text-sm font-semibold text-[#542c28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d344b]"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to music
          </Link>
        </div>
      </div>
    );
  }

  const dateLabel = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(release.releaseDate));

  const formatDuration = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

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

        <section aria-labelledby="release-title" className="mt-8 grid overflow-hidden rounded-[32px] bg-[#542c28] text-white shadow-[0_28px_80px_-48px_rgba(84,44,40,0.8)] lg:grid-cols-[minmax(280px,0.85fr)_1.15fr]">
          <div className="relative aspect-square bg-[#3b2424]">
            {release.coverUrl ? (
              <Image
                src={release.coverUrl}
                alt={`${release.title} cover artwork`}
                fill
                unoptimized
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full min-h-[400px] place-items-center">
                <span className="text-9xl font-semibold text-white/10">
                  M
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd18a]">
              {release.type === 'EP' ? 'EP' : release.type.toLowerCase()}
            </p>

            <h1 id="release-title" className="mt-4 font-serif text-4xl font-medium tracking-[-0.05em] sm:text-6xl">
              {release.title}
            </h1>

            <p className="mt-3 text-base text-white/75">{release.artistName}</p>
            <time dateTime={release.releaseDate} className="mt-2 text-sm text-white/50">
              Released {dateLabel}
            </time>

            {release.description && (
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/70">
                {release.description}
              </p>
            )}

            {release.links.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3" aria-label="Listen to this release">
                {release.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fff3e4] px-5 py-3 text-sm font-semibold text-[#542c28] transition hover:bg-[#ffd18a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                >
                  {link.platform}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-sm text-white/55">Streaming links haven&apos;t been added for this release yet.</p>
            )}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="tracklist-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b64d60]">The music</p>
              <h2 id="tracklist-title" className="mt-2 font-serif text-3xl font-medium tracking-[-0.035em] text-[#542c28]">
                Tracklist
              </h2>
            </div>
            <p className="text-sm text-[#654b44]/55">{release.tracks.length} {release.tracks.length === 1 ? 'track' : 'tracks'}</p>
          </div>

          <ol className="overflow-hidden rounded-[26px] border border-[#8b4a35]/10 bg-white shadow-sm">
            {release.tracks.map((track) => (
              <li
                key={track.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#8b4a35]/[0.08] px-5 py-4 last:border-b-0 sm:px-6 sm:py-5"
              >
                <span className="w-7 shrink-0 text-sm tabular-nums text-[#8d344b]/65">
                  {String(track.trackNumber).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#542c28]">
                    {track.title}
                  </p>
                  {track.durationSeconds && (
                    <p className="mt-1 text-xs tabular-nums text-[#654b44]/50">
                      {formatDuration(track.durationSeconds)}
                    </p>
                  )}
                </div>

                {track.previewUrl && (
                  <audio
                    aria-label={`Preview ${track.title}`}
                    controls
                    preload="none"
                    src={track.previewUrl}
                    className="h-10 w-full max-w-sm sm:w-[min(100%,320px)]"
                  >
                    Your browser does not support audio previews.
                  </audio>
                )}
              </li>
            ))}
          </ol>
          {query.isError && (
            <p role="status" className="mt-3 text-sm text-[#654b44]/65">Showing the saved release details; the latest refresh did not complete.</p>
          )}
        </section>
      </div>
    </div>
  );
}

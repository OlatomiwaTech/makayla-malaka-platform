'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Music2 } from 'lucide-react';

import { ReleaseCard } from '@/components/music/release-card';
import { MusicPlatformFallback } from '@/components/music/music-platform-fallback';
import { SectionHeader } from '@/components/home/section-header';
import {
  useFeaturedMusic,
  useMusic,
} from '@/hooks/use-music';
import type { ReleaseType } from '@/types/music';

const releaseFilters: Array<{ label: string; value?: ReleaseType }> = [
  { label: 'All releases' },
  { label: 'Singles', value: 'SINGLE' },
  { label: 'EPs', value: 'EP' },
  { label: 'Albums', value: 'ALBUM' },
];

const releaseDateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));

export default function MusicPage() {
  const [page, setPage] = useState(1);
  const [activeType, setActiveType] = useState<ReleaseType | undefined>();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useMusic(page, activeType);

  const {
    data: featuredData,
  } = useFeaturedMusic();

  const featured =
    featuredData?.data.release;
  const visibleFeatured = featured && (!activeType || featured.type === activeType)
    ? featured
    : null;
  const pagination = data?.data.pagination;

  return (
    <div className="bg-[#f7f5f1]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        <section className="mb-14 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-black/35">
            <Music2 size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Music
            </span>
          </div>

          <h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
            The soundtrack.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
            Explore Makayla&apos;s releases, tracks,
            collaborations and the music behind the
            moments.
          </p>
        </section>

        {visibleFeatured && (
          <section className="mb-20">
            <SectionHeader
              eyebrow="Featured"
              title="Listen now"
            />

            <div className="grid overflow-hidden rounded-[30px] bg-[#171717] text-white lg:grid-cols-[0.8fr_1.2fr]">
              <div className="aspect-square bg-[#252525] lg:aspect-auto">
                {visibleFeatured.coverUrl ? (
                  <Image
                    src={visibleFeatured.coverUrl}
                    alt={`${visibleFeatured.title} cover artwork`}
                    fill
                    unoptimized
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full min-h-[360px] place-items-center">
                    <span className="text-8xl font-semibold text-white/10">
                      M
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                    {visibleFeatured.type}
                  </p>

                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                    {visibleFeatured.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/50">{visibleFeatured.artistName}</p>
                  <time className="mt-2 block text-sm text-white/40" dateTime={visibleFeatured.releaseDate}>
                    Released {releaseDateLabel(visibleFeatured.releaseDate)}
                  </time>

                  {visibleFeatured.description && (
                    <p className="mt-5 max-w-xl text-sm leading-6 text-white/50">
                      {visibleFeatured.description}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  {visibleFeatured.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Listen on {link.platform}
                    </a>
                  ))}
                  <Link
                    href={`/music/${visibleFeatured.id}`}
                    className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Release details
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <SectionHeader
            eyebrow="Catalog"
            title="All releases"
          />

          <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filter releases by type">
            {releaseFilters.map((filter) => {
              const selected = activeType === filter.value;

              return (
                <button
                  key={filter.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setPage(1);
                    setActiveType(filter.value);
                  }}
                  className={`min-h-10 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3443d] ${
                    selected
                      ? 'bg-[#8d344b] text-white'
                      : 'border border-[#8b4a35]/15 bg-white text-[#654b44]/75 hover:border-[#8d344b]/40 hover:text-[#8d344b]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {pagination && !isError && !isLoading && (
            <p className="mb-5 text-sm text-[#654b44]/60" aria-live="polite">
              {pagination.total} {pagination.total === 1 ? 'release' : 'releases'}
              {activeType ? ` · ${releaseFilters.find((filter) => filter.value === activeType)?.label}` : ''}
            </p>
          )}

          {isLoading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="aspect-[0.8] animate-pulse rounded-[26px] bg-black/5"
                  />
                ),
              )}
            </div>
          )}

          {isError && (
            <div role="alert" className="rounded-3xl border border-red-900/10 bg-white p-6 sm:p-8">
              <h3 className="font-serif text-2xl text-[#542c28]">The catalogue couldn&apos;t load</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#654b44]/70">Please try again in a moment. Makayla&apos;s official artist pages are also available below.</p>
              <button type="button" onClick={() => void refetch()} className="mt-5 min-h-11 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d344b]">Try again</button>
              <div className="mt-5"><MusicPlatformFallback unavailable /></div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            !data?.data.releases.length &&
            !activeType && (
              <MusicPlatformFallback />
            )}

          {!isLoading && !isError && !data?.data.releases.length && activeType && (
            <div className="rounded-[26px] border border-[#8b4a35]/10 bg-white px-6 py-10 text-center">
              <h3 className="font-serif text-2xl text-[#542c28]">No {activeType === 'SINGLE' ? 'singles' : activeType === 'EP' ? 'EPs' : 'albums'} here yet</h3>
              <p className="mt-2 text-sm text-[#654b44]/65">Try another release type or browse the complete catalogue.</p>
              <button type="button" onClick={() => { setPage(1); setActiveType(undefined); }} className="mt-5 min-h-11 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d344b]">Browse all releases</button>
            </div>
          )}

          {!isLoading &&
            !isError &&
            data?.data.releases.length ? (
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.data.releases.map(
                  (release) => (
                    <ReleaseCard
                      key={release.id}
                      release={release}
                    />
                  ),
                )}
              </div>
            ) : null}

          {!isLoading && !isError && pagination && pagination.totalPages > 1 && (
            <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#8b4a35]/10 pt-5" aria-label="Music catalogue pages">
              <p className="text-sm text-[#654b44]/65">Page {pagination.page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8b4a35]/15 bg-white px-4 text-sm font-semibold text-[#542c28] transition hover:border-[#8d344b]/40 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} aria-hidden="true" /> Previous</button>
                <button type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8b4a35]/15 bg-white px-4 text-sm font-semibold text-[#542c28] transition hover:border-[#8d344b]/40 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={16} aria-hidden="true" /></button>
              </div>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

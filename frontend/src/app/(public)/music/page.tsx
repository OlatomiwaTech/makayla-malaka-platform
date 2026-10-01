'use client';

import { Music2 } from 'lucide-react';

import { ReleaseCard } from '@/components/music/release-card';
import { SectionHeader } from '@/components/home/section-header';
import {
  useFeaturedMusic,
  useMusic,
} from '@/hooks/use-music';

export default function MusicPage() {
  const {
    data,
    isLoading,
    isError,
  } = useMusic();

  const {
    data: featuredData,
  } = useFeaturedMusic();

  const featured =
    featuredData?.data.release;

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
            Explore Makayla's releases, tracks,
            collaborations and the music behind the
            moments.
          </p>
        </section>

        {featured && (
          <section className="mb-20">
            <SectionHeader
              eyebrow="Featured"
              title="Listen now"
            />

            <div className="grid overflow-hidden rounded-[30px] bg-[#171717] text-white lg:grid-cols-[0.8fr_1.2fr]">
              <div className="aspect-square bg-[#252525] lg:aspect-auto">
                {featured.coverUrl ? (
                  <img
                    src={featured.coverUrl}
                    alt={`${featured.title} cover`}
                    className="h-full w-full object-cover"
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
                    {featured.type}
                  </p>

                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                    {featured.title}
                  </h2>

                  {featured.description && (
                    <p className="mt-5 max-w-xl text-sm leading-6 text-white/50">
                      {featured.description}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  {featured.links.map((link) => (
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
            <div className="rounded-[26px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              We couldn't load the music catalog.
            </div>
          )}

          {!isLoading &&
            !isError &&
            !data?.data.releases.length && (
              <div className="rounded-[30px] bg-white p-10 text-center">
                <p className="font-medium">
                  No releases yet.
                </p>

                <p className="mt-2 text-sm text-black/45">
                  New music will appear here.
                </p>
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
        </section>
      </div>
    </div>
  );
}

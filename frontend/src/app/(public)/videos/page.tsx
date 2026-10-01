'use client';

import { Video as VideoIcon } from 'lucide-react';

import { SectionHeader } from '@/components/home/section-header';
import { VideoCard } from '@/components/videos/video-card';
import { useVideos } from '@/hooks/use-videos';

const categories = [
  'All',
  'Music Videos',
  'REFIXES',
  'Performances',
  'Interviews',
  'Behind the Scenes',
];

export default function VideosPage() {
  const {
    data,
    isLoading,
    isError,
  } = useVideos();

  return (
    <div className="bg-[#f7f5f1]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="mb-12 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-black/35">
            <VideoIcon size={16} />

            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Videos
            </span>
          </div>

          <h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
            Watch Makayla.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
            Music videos, REFIXES, performances,
            interviews and moments from behind the
            scenes.
          </p>
        </section>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                category === 'All'
                  ? 'bg-black text-white'
                  : 'border border-black/10 bg-white text-black/55'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <section>
          <SectionHeader
            eyebrow="Latest"
            title="Watch now"
          />

          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="aspect-video animate-pulse rounded-[26px] bg-black/5"
                  />
                ),
              )}
            </div>
          )}

          {isError && (
            <div className="rounded-[26px] bg-red-50 p-6 text-sm text-red-700">
              We couldn't load the videos.
            </div>
          )}

          {!isLoading &&
            !isError &&
            !data?.data.videos.length && (
              <div className="rounded-[30px] bg-white p-10 text-center">
                <p className="font-medium">
                  No videos yet.
                </p>

                <p className="mt-2 text-sm text-black/45">
                  New videos will appear here.
                </p>
              </div>
            )}

          {!isLoading &&
            !isError &&
            data?.data.videos.length ? (
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {data.data.videos.map(
                  (video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
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

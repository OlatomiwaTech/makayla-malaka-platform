'use client';

import { useState } from 'react';
import { Video as VideoIcon } from 'lucide-react';

import { SectionHeader } from '@/components/home/section-header';
import { VideoCard } from '@/components/videos/video-card';
import { VideoChannelFallback } from '@/components/videos/video-channel-fallback';
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
  const [activeCategory, setActiveCategory] = useState('All');
  const {
    data,
    isLoading,
    isError,
  } = useVideos(
    1,
    activeCategory === 'All' ? undefined : activeCategory,
  );

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
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3443d] ${
                activeCategory === category
                  ? 'bg-[#a3443d] text-white'
                  : 'border border-black/10 bg-white text-black/55 hover:border-[#a3443d]/40 hover:text-[#a3443d]'
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

          {isError && <VideoChannelFallback unavailable />}

          {!isLoading &&
            !isError &&
            !data?.data.videos.length &&
            activeCategory === 'All' && (
              <VideoChannelFallback />
            )}

          {!isLoading &&
            !isError &&
            !data?.data.videos.length &&
            activeCategory !== 'All' && (
              <div className="rounded-[26px] border border-black/5 bg-white px-6 py-12 text-center">
                <p className="text-lg font-semibold">No {activeCategory.toLowerCase()} yet</p>
                <p className="mt-2 text-sm text-black/50">Check back soon, or browse all of Makayla’s videos.</p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="mt-5 rounded-full bg-[#a3443d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#873832] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3443d]"
                >
                  Show all videos
                </button>
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

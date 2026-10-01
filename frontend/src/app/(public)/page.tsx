import { Hero } from '@/components/home/hero';
import { SectionHeader } from '@/components/home/section-header';
import { MusicSpotlight } from '@/components/home/music-spotlight';
import { EventSpotlight } from '@/components/home/event-spotlight';
import { PostList } from '@/components/posts/post-list';

export default function HomePage() {
  return (
    <div className="bg-[#f7f5f1]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Hero />

        <div className="mt-16">
          <SectionHeader
            eyebrow="Latest"
            title="From Makayla"
            href="/feed"
          />

          <PostList />
        </div>

        <div className="mt-20">
          <SectionHeader
            eyebrow="Music"
            title="Listen to Makayla"
            href="/music"
          />

          <MusicSpotlight />
        </div>

        <div className="mt-20">
          <EventSpotlight />
        </div>

        <section className="mt-20 pb-8">
          <div className="rounded-[30px] bg-[#171717] px-7 py-10 text-white sm:px-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              Stay connected
            </p>

            <div className="mt-4 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Keep up with what's happening in Makayla's world.
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/50">
                  New music, events, content and moments — all in one place.
                </p>
              </div>

              <button
                type="button"
                className="w-fit rounded-full bg-[#d7ff42] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2ff70]"
              >
                Join the community
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
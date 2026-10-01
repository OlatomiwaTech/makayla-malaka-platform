import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';

export function MusicSpotlight() {
  return (
    <section className="overflow-hidden rounded-[30px] bg-[#e9e6df]">
      <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
        <div className="min-h-[300px] bg-[#111] p-7 text-white sm:p-10">
          <div className="flex h-full flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Music
            </span>

            <div>
              <p className="text-sm text-white/40">
                Latest release
              </p>

              <h3 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                Coming next.
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
              Listen everywhere
            </p>

            <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em]">
              Discover Makayla's music, releases and collaborations.
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
              Explore the catalog and find your next favorite track.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/music"
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              <Play size={15} fill="currentColor" />
              Explore music
            </Link>

            <Link
              href="/music"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold"
            >
              View catalog
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';

type HeroProps = {
  title?: string;
  description?: string;
};

export function Hero({
  title = 'Makayla Malaka',
  description = "Music, moments, events and everything happening in Makayla's world.",
}: HeroProps) {
  return (
    <section className="overflow-hidden rounded-[32px] bg-[#171717] text-white">
      <div className="grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#d7ff42]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              Official
            </span>
          </div>

          <div className="max-w-xl py-14 lg:py-20">
            <p className="mb-5 text-sm font-medium text-white/45">
              MUSIC · LIFE · MOMENTS
            </p>

            <h1 className="text-5xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/60 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/music"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <Play size={15} fill="currentColor" />
                Explore music
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Upcoming events
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/40">
            <span>Makayla's official platform</span>
            <span>2026</span>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[#242424] lg:min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(215,255,66,0.28),transparent_34%),radial-gradient(circle_at_75%_70%,rgba(124,58,237,0.28),transparent_36%)]" />

          <div className="absolute inset-6 rounded-[28px] border border-white/10" />

          <div className="absolute bottom-10 left-10 right-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
              THE WORLD OF
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Makayla
            </p>
          </div>

          <div className="absolute right-10 top-10 grid size-20 place-items-center rounded-full border border-white/10 bg-white/5 backdrop-blur">
            <span className="text-2xl font-semibold">M</span>
          </div>
        </div>
      </div>
    </section>
  );
}

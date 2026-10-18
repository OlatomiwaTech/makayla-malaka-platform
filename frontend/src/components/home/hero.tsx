import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';

type HeroProps = {
  latestVideoHref?: string;
};

export function Hero({
  latestVideoHref,
}: HeroProps) {
  return (
    <section className="grid overflow-hidden bg-white shadow-sm lg:min-h-[540px] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-between px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 bg-[#ed1689]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
            Official artist platform
          </span>
        </div>

        <div className="max-w-xl py-12 lg:py-16">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c30c6c]">
            Music · life · moments
          </p>

          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
            Makayla
            <br />
            <span className="text-[#ed1689]">Malaka.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-black/60 sm:text-lg">
            Welcome to the official home of Makayla Malaka. Discover her music,
            watch the latest videos, and keep up with what&apos;s new.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/music"
              className="inline-flex min-h-12 items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]"
            >
              <Play size={15} fill="currentColor" />
              Explore music
            </Link>

            <Link
              href={latestVideoHref ?? '/videos'}
              className="inline-flex min-h-12 items-center gap-2 border border-black/15 px-5 py-3 text-sm font-semibold text-black transition-colors hover:border-[#ed1689] hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]"
            >
              {latestVideoHref ? 'Watch latest video' : 'Watch videos'}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <p className="border-t border-black/10 pt-5 text-xs text-black/45">
          Music, stories, and everything in between.
        </p>
      </div>

      <div className="relative grid min-h-[300px] place-items-center bg-[#ed1689] p-5 sm:min-h-[420px] sm:p-8 lg:min-h-full">
        <div className="absolute inset-x-5 top-5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-black/65 sm:inset-x-8 sm:top-8">
          <span>Makayla Malaka</span>
          <span>MM</span>
        </div>
        <Image
          src="/Logo.png"
          alt="Makayla Malaka logo"
          width={1280}
          height={1280}
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="mt-8 h-auto max-h-[440px] w-full max-w-[520px] object-contain"
        />
      </div>
    </section>
  );
}

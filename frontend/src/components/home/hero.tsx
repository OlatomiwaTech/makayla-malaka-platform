import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Music2, Play } from 'lucide-react';

type HeroProps = {
  latestVideoHref?: string;
};

export function Hero({ latestVideoHref }: HeroProps) {
  return (
    <section className="relative isolate grid overflow-hidden rounded-[1.75rem] border border-black/10 bg-white lg:min-h-[590px] lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative z-10 order-2 flex flex-col justify-between px-6 py-8 sm:px-10 sm:py-11 lg:order-1 lg:px-14 lg:py-12">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#ed1689] text-white" aria-hidden="true"><Music2 size={18} /></span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/50">The official home of</p>
            <p className="mt-0.5 text-sm font-semibold text-black">Makayla Malaka</p>
          </div>
        </div>

        <div className="max-w-xl py-12 lg:py-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c30c6c]">A little music. A lot of heart.</p>
          <h1 className="font-serif text-[3.5rem] font-medium leading-[0.94] tracking-[-0.055em] text-[#111] sm:text-7xl lg:text-[5.4rem]">
            Come on in<span className="text-[#ed1689]">.</span>
            <br />
            <span className="italic text-[#ed1689]">Stay awhile.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
            Welcome to Makayla&apos;s world of feel-good music, big dreams and fun moments. There&apos;s always something new to discover here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/music" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#ed1689] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
              <Play size={15} fill="currentColor" /> Listen to the music
            </Link>
            <Link href={latestVideoHref ?? '/videos'} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-[#111] transition hover:border-[#ed1689] hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
              Watch Makayla <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="border-t border-black/10 pt-5 text-xs font-semibold uppercase tracking-[0.15em] text-black/50">
          Music · moments · Makayla
        </div>
      </div>

      <div className="relative order-1 min-h-[300px] overflow-hidden bg-[#0b0b0d] sm:min-h-[400px] lg:order-2 lg:min-h-full">
        <div className="absolute inset-y-0 left-0 z-20 w-1.5 bg-[#ed1689]" />
        <Image
          src="/makayla-image.jpg"
          alt="Makayla Malaka smiling"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="relative z-10 object-contain object-bottom px-4 pt-8 sm:px-8 sm:pt-10"
        />
        <div className="absolute bottom-5 left-5 z-20 border-l-2 border-[#ed1689] bg-black/80 px-4 py-3 text-white sm:bottom-8 sm:left-8 sm:px-5 sm:py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff71bb]">Making memories</p>
          <p className="mt-1 font-serif text-xl italic sm:text-2xl">one song at a time</p>
        </div>
        <span className="absolute right-5 top-5 z-20 grid size-14 place-items-center rounded-full bg-[#ed1689] text-center text-[9px] font-bold uppercase leading-3 tracking-wide text-white sm:right-8 sm:top-8 sm:size-16">
          Good<br />vibes<br />only
        </span>
      </div>
    </section>
  );
}

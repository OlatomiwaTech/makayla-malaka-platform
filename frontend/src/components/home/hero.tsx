import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

type HeroProps = {
  latestVideoHref?: string;
};

export function Hero({ latestVideoHref }: HeroProps) {
  return (
    <section className="relative isolate grid overflow-hidden rounded-[2rem] bg-[#fff3e4] shadow-[0_24px_80px_-48px_rgba(92,43,30,0.38)] ring-1 ring-[#8b4a35]/10 lg:min-h-[600px] lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative z-10 flex flex-col justify-between px-6 py-8 sm:px-10 sm:py-11 lg:px-14 lg:py-12">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#f8d8bd] text-lg" aria-hidden="true">✳</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b4a35]/65">The official home of</p>
            <p className="mt-0.5 text-sm font-semibold text-[#542c28]">Makayla Malaka</p>
          </div>
        </div>

        <div className="max-w-xl py-12 lg:py-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#b64d60]">A little music. A lot of heart.</p>
          <h1 className="font-serif text-[3.5rem] font-medium leading-[0.94] tracking-[-0.055em] text-[#542c28] sm:text-7xl lg:text-[5.4rem]">
            Come on in<span className="text-[#d85b70]">.</span>
            <br />
            <span className="italic text-[#b64d60]">Stay awhile.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#654b44]/80 sm:text-lg sm:leading-8">
            Welcome to Makayla&apos;s world of feel-good music, big dreams and fun moments. There&apos;s always something new to discover here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/music" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#8d344b] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8d344b]/15 transition hover:-translate-y-0.5 hover:bg-[#74283d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8d344b]">
              <Play size={15} fill="currentColor" /> Listen to the music
            </Link>
            <Link href={latestVideoHref ?? '/videos'} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#8b4a35]/20 bg-white/60 px-5 py-3 text-sm font-semibold text-[#542c28] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8d344b]">
              Watch Makayla <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-[#8b4a35]/15 pt-5 text-xs font-medium text-[#654b44]/65">
          <span className="flex -space-x-2" aria-hidden="true">
            <span className="size-7 rounded-full border-2 border-[#fff3e4] bg-[#e7a969]" />
            <span className="size-7 rounded-full border-2 border-[#fff3e4] bg-[#c77c70]" />
            <span className="size-7 rounded-full border-2 border-[#fff3e4] bg-[#98a889]" />
          </span>
          <span>For the fans, families & dreamers</span>
        </div>
      </div>

      <div className="relative min-h-[360px] overflow-hidden bg-[#e8b89a] sm:min-h-[520px] lg:min-h-full">
        <div className="absolute -right-12 -top-14 size-64 rounded-full bg-[#f8d8bd]/75 sm:size-80" />
        <div className="absolute -bottom-20 -left-12 size-64 rounded-full bg-[#d88c7c]/45 sm:size-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(255,255,255,0.42),transparent_34%)]" />
        <Image
          src="/makayla-image.jpg"
          alt="Makayla Malaka smiling"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="relative z-10 object-contain object-bottom px-4 pt-8 sm:px-8 sm:pt-10"
        />
        <div className="absolute bottom-5 left-5 z-20 rounded-2xl border border-white/60 bg-[#fffaf3]/90 px-4 py-3 shadow-lg backdrop-blur sm:bottom-8 sm:left-8 sm:px-5 sm:py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b64d60]">Making memories</p>
          <p className="mt-1 font-serif text-xl italic text-[#542c28] sm:text-2xl">one song at a time</p>
        </div>
        <span className="absolute right-5 top-5 z-20 grid size-14 rotate-12 place-items-center rounded-full bg-[#f8d16e] text-center text-[9px] font-bold uppercase leading-3 tracking-wide text-[#542c28] shadow-md sm:right-8 sm:top-8 sm:size-16">
          Good<br />vibes<br />only
        </span>
      </div>
    </section>
  );
}

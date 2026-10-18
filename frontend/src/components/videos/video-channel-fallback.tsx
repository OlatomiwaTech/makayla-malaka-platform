import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';

export function VideoChannelFallback({ unavailable = false }: { unavailable?: boolean }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-[#8b4a35]/10 bg-white shadow-sm sm:grid-cols-[minmax(200px,0.85fr)_1.15fr]">
      <div className="relative min-h-48 bg-[#321c32] sm:min-h-56">
        <Image src="/makayla-perform.avif" alt="Makayla performing live on stage" fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover" />
      </div>
      <div className="flex flex-col items-start justify-center p-6 sm:p-8">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#f7e8d8] text-[#8d344b]"><Play size={18} fill="currentColor" aria-hidden="true" /></span>
        <h3 className="mt-4 font-serif text-2xl text-[#542c28]">Watch Makayla on YouTube</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#654b44]/70">
          {unavailable
            ? 'The video library is taking a little longer to load. Visit Makayla’s official channel to keep watching.'
            : 'Browse official videos, Refixes and live performances on Makayla’s official channel.'}
        </p>
        <a href="https://www.youtube.com/@MakaylaSuperstar" target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d]">
          Visit YouTube channel<ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}

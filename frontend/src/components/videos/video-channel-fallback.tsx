import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';

export function VideoChannelFallback({ unavailable = false, brand = false }: { unavailable?: boolean; brand?: boolean }) {
  return (
    <div className={`grid overflow-hidden rounded-2xl border bg-white sm:grid-cols-[minmax(200px,0.85fr)_1.15fr] ${brand ? 'border-black/10' : 'border-[#8b4a35]/10 shadow-sm'}`}>
      <div className="relative min-h-48 bg-[#111] sm:min-h-56">
        <Image src="/makayla-perform.avif" alt="Makayla performing live on stage" fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover" />
      </div>
      <div className="flex flex-col items-start justify-center p-6 sm:p-8">
        <span className={`grid size-11 place-items-center rounded-full ${brand ? 'bg-[#ed1689] text-white' : 'rounded-2xl bg-[#f7e8d8] text-[#8d344b]'}`}><Play size={18} fill="currentColor" aria-hidden="true" /></span>
        <h3 className={`mt-4 font-serif text-2xl ${brand ? 'text-[#111]' : 'text-[#542c28]'}`}>Watch Makayla on YouTube</h3>
        <p className={`mt-2 max-w-xl text-sm leading-6 ${brand ? 'text-black/65' : 'text-[#654b44]/70'}`}>
          {unavailable
            ? 'The video library is taking a little longer to load. Visit Makayla’s official channel to keep watching.'
            : 'Browse official videos, Refixes and live performances on Makayla’s official channel.'}
        </p>
        <a href="https://www.youtube.com/@MakaylaSuperstar" target="_blank" rel="noopener noreferrer" className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition ${brand ? 'bg-[#ed1689] hover:bg-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1689]' : 'bg-[#8d344b] hover:bg-[#74283d]'}`}>
          Visit YouTube channel<ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}

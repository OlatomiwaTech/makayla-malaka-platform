import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Find Makayla Malaka’s live appearances and event announcements.',
};

const channels = [
  { label: 'Instagram', href: 'https://www.instagram.com/makaylasuperstar/?hl=en' },
  { label: 'Facebook', href: 'https://www.facebook.com/makaylasuperstar/' },
];

export default function EventsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative isolate flex min-h-[340px] items-end overflow-hidden rounded-[2rem] bg-[#321c32] sm:min-h-[430px]">
        <Image src="/makayla-perform.avif" alt="Makayla performing live on stage" fill sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#241323]/90 via-[#241323]/55 to-[#241323]/5" />
        <div className="max-w-2xl px-6 py-9 text-white sm:px-10 sm:py-12">
          <CalendarDays size={25} className="mb-5 text-[#f8d16e]" aria-hidden="true" />
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f8d16e]">Save a spot for the music</p>
          <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">See you out there.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base">Makayla’s live moments are best shared together. New public event dates will be posted here as they’re announced.</p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#8b4a35]/10 bg-white p-6 sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b64d60]">Upcoming dates</p>
        <h2 className="mt-2 font-serif text-3xl text-[#542c28]">No public dates just yet</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#654b44]/70">Follow Makayla’s official channels to hear about performances, appearances and new announcements first.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {channels.map((channel) => (
            <a key={channel.href} href={channel.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d]">
              Follow on {channel.label}<ArrowUpRight size={15} />
            </a>
          ))}
          <Link href="/videos" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8b4a35]/20 px-5 py-3 text-sm font-semibold text-[#542c28] transition hover:bg-[#fff3e4]">
            Watch live moments<ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}

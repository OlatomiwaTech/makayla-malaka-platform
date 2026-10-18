import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Facebook, Instagram, Music2, Youtube } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the Makayla Malaka community through her official channels.',
};

const channels = [
  { label: 'Instagram', description: 'Photos, Refixes and everyday moments.', href: 'https://www.instagram.com/makaylasuperstar/?hl=en', icon: Instagram },
  { label: 'Facebook', description: 'News and updates from Makayla’s official page.', href: 'https://www.facebook.com/makaylasuperstar/', icon: Facebook },
  { label: 'YouTube', description: 'Official videos and new performances.', href: 'https://www.youtube.com/@MakaylaSuperstar', icon: Youtube },
  { label: 'YouTube Music', description: 'Listen to Makayla’s music catalogue.', href: 'https://music.youtube.com/channel/UCNY3D79_l_o0MIAL_sOOcog', icon: Music2 },
];

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-[2rem] bg-[#fff3e4] px-6 py-10 shadow-sm ring-1 ring-[#8b4a35]/10 sm:px-10 sm:py-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b64d60]">For the fans, families & dreamers</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl tracking-[-0.045em] text-[#542c28] sm:text-6xl">There’s room for you here.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#654b44]/75">Follow along, enjoy the music, and share the moments that make you smile. Find Makayla on her official channels below.</p>
      </section>

      <section className="mt-10" aria-labelledby="official-channels-heading">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b64d60]">Stay connected</p>
          <h2 id="official-channels-heading" className="mt-2 font-serif text-3xl text-[#542c28] sm:text-4xl">Meet us where you are</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a key={channel.href} href={channel.href} target="_blank" rel="noreferrer" className="group flex min-h-32 items-start gap-4 rounded-3xl border border-[#8b4a35]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f7e8d8] text-[#8d344b]"><Icon size={21} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold text-[#542c28]">{channel.label}<ArrowUpRight size={14} className="text-[#b64d60] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                  <span className="mt-2 block text-sm leading-6 text-[#654b44]/65">{channel.description}</span>
                </span>
              </a>
            );
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/music" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d]">Explore music<ArrowUpRight size={15} /></Link>
          <Link href="/videos" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8b4a35]/20 px-5 py-3 text-sm font-semibold text-[#542c28] transition hover:bg-[#fff3e4]">Watch videos<ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}

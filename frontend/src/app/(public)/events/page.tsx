'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { EventsResponse } from '@/types/event';

const channels = [
  { label: 'Instagram', href: 'https://www.instagram.com/makaylasuperstar/?hl=en' },
  { label: 'Facebook', href: 'https://www.facebook.com/makaylasuperstar/' },
];

export default function EventsPage() {
  const [period, setPeriod] = useState<'upcoming' | 'past'>('upcoming');
  const [page, setPage] = useState(1);
  const query = useQuery({ queryKey: ['events', period, page], queryFn: () => api<EventsResponse>(`/events?period=${period}&page=${page}&limit=12`) });
  const events = query.data?.data.events ?? [];

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden rounded-[2rem] bg-[#321c32] sm:min-h-[430px]">
      <Image src="/makayla-perform.avif" alt="Makayla performing live on stage" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#241323]/90 via-[#241323]/55 to-[#241323]/5" />
      <div className="max-w-2xl px-6 py-9 text-white sm:px-10 sm:py-12"><CalendarDays size={25} className="mb-5 text-[#f8d16e]" aria-hidden="true" /><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f8d16e]">Save a spot for the music</p><h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">See you out there.</h1><p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base">Find Makayla’s upcoming performances, appearances, and past live moments.</p></div>
    </section>

    <section className="mt-8 rounded-3xl border border-[#8b4a35]/10 bg-white p-6 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b64d60]">Event calendar</p><h2 className="mt-2 font-serif text-3xl text-[#542c28]">{period === 'upcoming' ? 'Upcoming events' : 'Past events'}</h2></div><div className="flex gap-2">{(['upcoming', 'past'] as const).map((value) => <button key={value} type="button" aria-pressed={period === value} onClick={() => { setPeriod(value); setPage(1); }} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${period === value ? 'bg-[#8d344b] text-white' : 'border border-[#8b4a35]/20 text-[#542c28]'}`}>{value}</button>)}</div></div>
      {query.isLoading && <div className="mt-7 grid gap-4 md:grid-cols-2">{[0, 1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-[#f7f5f1]" />)}</div>}
      {query.isError && <p role="alert" className="mt-7 rounded-2xl bg-red-50 p-5 text-sm text-red-700">Events are temporarily unavailable. Please try again in a moment.</p>}
      {!query.isLoading && !query.isError && events.length === 0 && <div className="mt-7 rounded-2xl bg-[#f7f5f1] p-7"><h3 className="font-serif text-2xl text-[#542c28]">{period === 'upcoming' ? 'No public dates just yet' : 'No past events to show yet'}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-[#654b44]/70">Follow Makayla’s official channels to hear about performances, appearances and new announcements first.</p>{period === 'upcoming' && <div className="mt-5 flex flex-wrap gap-3">{channels.map((channel) => <a key={channel.href} href={channel.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d]">Follow on {channel.label}<ArrowUpRight size={15} /></a>)}</div>}</div>}
      {!query.isLoading && !query.isError && events.length > 0 && <div className="mt-7 grid gap-4 md:grid-cols-2">{events.map((event) => <article key={event.id} className="overflow-hidden rounded-2xl border border-[#8b4a35]/10 bg-white"><Link href={`/events/${event.id}`} className="group flex h-full flex-col sm:flex-row"><div className="relative aspect-[16/9] shrink-0 bg-[#f7f5f1] sm:aspect-square sm:w-40">{event.imageUrl ? <img src={event.imageUrl} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center"><CalendarDays className="text-[#8b4a35]/30" /></div>}</div><div className="flex min-w-0 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#b64d60]">{event.status === 'LIVE' ? 'Live now' : period === 'past' ? 'Past event' : 'Upcoming'}</p><h3 className="mt-2 text-xl font-semibold text-[#542c28] group-hover:text-[#8d344b]">{event.title}</h3><p className="mt-2 text-sm text-[#654b44]/75">{new Date(event.startsAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>{event.location && <p className="mt-1 flex items-center gap-1 text-sm text-[#654b44]/65"><MapPin size={14} />{event.location}</p>}<span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#8d344b]">Event details <ArrowUpRight size={14} /></span></div></Link></article>)}</div>}
      {query.data && query.data.data.pagination.totalPages > 1 && <div className="mt-7 flex items-center justify-between"><p className="text-sm text-[#654b44]/65">Page {page} of {query.data.data.pagination.totalPages}</p><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-full border border-[#8b4a35]/20 px-4 py-2 text-sm disabled:opacity-40">Previous</button><button type="button" disabled={!query.data.data.pagination.hasNextPage} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-[#8b4a35]/20 px-4 py-2 text-sm disabled:opacity-40">Next</button></div></div>}
    </section>
    <div className="mt-6 flex justify-end"><Link href="/videos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#542c28] hover:text-[#8d344b]">Watch live moments<ArrowUpRight size={15} /></Link></div>
  </main>;
}

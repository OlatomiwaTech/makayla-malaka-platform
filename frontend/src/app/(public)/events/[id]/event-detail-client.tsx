'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Event, EventResponse } from '@/types/event';

export default function EventDetailClient({ id, initialEvent }: { id: string; initialEvent?: Event }) {
  const query = useQuery({ queryKey: ['event-detail', id], queryFn: () => api<EventResponse>(`/events/${id}`), ...(initialEvent ? { initialData: { success: true, data: { event: initialEvent } }, staleTime: 300000 } : {}) });
  if (query.isLoading) return <main className="mx-auto max-w-5xl px-4 py-12"><div className="aspect-[16/8] animate-pulse rounded-[30px] bg-black/5" /></main>;
  if (query.isError || !query.data) return <main className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-2xl font-semibold">Event not found</h1><p className="mt-2 text-sm text-black/50">This event may have been removed or is no longer public.</p><Link href="/events" className="mt-4 inline-block text-sm font-medium underline">Back to events</Link></main>;
  const event = query.data.data.event;
  const formatDate = (value: string) => new Date(value).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' });
  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"><Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black"><ArrowLeft size={16} /> Back to events</Link>
    <article className="mt-7 overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-sm">{event.imageUrl && <div className="max-h-[560px] overflow-hidden bg-[#f7f5f1]"><img src={event.imageUrl} alt={event.title} className="max-h-[560px] w-full object-cover" /></div>}<div className="p-6 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a3443d]">{event.status === 'LIVE' ? 'Live now' : event.status === 'COMPLETED' ? 'Past event' : 'Upcoming event'}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{event.title}</h1><div className="mt-6 flex flex-col gap-3 text-sm text-black/60 sm:flex-row sm:gap-8"><p className="flex items-start gap-2"><CalendarDays size={17} className="mt-0.5 shrink-0" /><span>{formatDate(event.startsAt)}{event.endsAt && <><br /><span className="text-black/40">Until {formatDate(event.endsAt)}</span></>}</span></p>{event.location && <p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0" />{event.location}</p>}</div>{event.description && <p className="mt-8 max-w-3xl whitespace-pre-line text-base leading-7 text-black/65">{event.description}</p>}{event.registrationUrl && event.status !== 'COMPLETED' && <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#8d344b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d]">Registration and tickets<ArrowUpRight size={16} /></a>}</div></article>
  </main>;
}

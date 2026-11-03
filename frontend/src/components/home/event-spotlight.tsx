import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';

import { useEvents } from '@/hooks/use-events';

const eventDateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export function EventSpotlight() {
  const query = useEvents('upcoming', 1, 3);
  const events = query.data?.data.events ?? [];

  return (
    <section className="pt-16 sm:pt-20" aria-labelledby="home-events-heading">
      <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a6538]">See you there</p>
          <h2 id="home-events-heading" className="mt-2 font-serif text-3xl font-medium tracking-[-0.035em] text-[#542c28] sm:text-4xl">Upcoming events</h2>
        </div>
        <Link href="/events" className="rounded-full border border-[#8b4a35]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#765033] transition hover:bg-white">See all →</Link>
      </div>

      {query.isPending && (
        <div className="grid gap-5 md:grid-cols-3" aria-label="Loading upcoming events">
          {[0, 1, 2].map((item) => <div key={item} className="h-64 animate-pulse rounded-3xl bg-[#f4e9dc]" />)}
        </div>
      )}

      {query.isError && (
        <div role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p>Upcoming events are temporarily unavailable.</p>
          <button type="button" onClick={() => void query.refetch()} className="mt-2 font-semibold underline">Try again</button>
        </div>
      )}

      {!query.isPending && !query.isError && events.length === 0 && (
        <div className="border-y border-black/10 py-8">
          <h3 className="font-serif text-2xl text-[#542c28]">No public dates just yet</h3>
          <p className="mt-2 text-sm leading-6 text-black/55">New performances and appearances will show up here when they are announced.</p>
        </div>
      )}

      {!query.isPending && !query.isError && events.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="group overflow-hidden rounded-3xl border border-[#8b4a35]/10 bg-white shadow-[0_12px_40px_-32px_rgba(84,44,40,0.5)]">
              <Link href={`/events/${event.id}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#b77a35]">
                <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-[#f4e9dc]">
                  {event.imageUrl ? (
                    <Image src={event.imageUrl} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <CalendarDays size={32} strokeWidth={1.2} className="text-[#b77a35]" aria-hidden="true" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a6538]">{event.status === 'LIVE' ? 'Live now' : 'Coming up'}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#542c28] group-hover:text-[#8a5b2d]">{event.title}</h3>
                  <time dateTime={event.startsAt} className="mt-3 flex items-center gap-2 text-sm text-black/55"><CalendarDays size={15} aria-hidden="true" />{eventDateLabel(event.startsAt)}</time>
                  {event.location && <p className="mt-2 flex items-center gap-2 text-sm text-black/55"><MapPin size={15} aria-hidden="true" />{event.location}</p>}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#765033]">Event details <ArrowUpRight size={15} /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';

export function EventSpotlight() {
  return (
    <section className="rounded-[30px] border border-black/[0.07] bg-white p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
            Next up
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Upcoming events
          </h2>
        </div>

        <div className="grid size-11 place-items-center rounded-full bg-[#f2f0eb]">
          <CalendarDays size={19} />
        </div>
      </div>

      <div className="mt-8 rounded-[24px] bg-[#f5f3ef] p-6">
        <p className="text-sm font-semibold text-black/40">
          EVENT
        </p>

        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
          No upcoming events yet
        </h3>

        <p className="mt-3 max-w-lg text-sm leading-6 text-black/50">
          When a new event is announced, you'll find all the details here.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-black/45">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={15} />
            Coming soon
          </span>

          <span className="inline-flex items-center gap-2">
            <MapPin size={15} />
            Location announced later
          </span>
        </div>
      </div>

      <Link
        href="/events"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
      >
        Explore events
        <ArrowUpRight size={15} />
      </Link>
    </section>
  );
}

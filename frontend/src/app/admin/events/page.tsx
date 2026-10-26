'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, Pencil, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import type { Event, EventStatus, EventsResponse, EventResponse } from '@/types/event';

const statuses: EventStatus[] = ['DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'];
type FormState = { title: string; description: string; imageUrl: string; location: string; startsAt: string; endsAt: string; registrationUrl: string; status: EventStatus };
const blank: FormState = { title: '', description: '', imageUrl: '', location: '', startsAt: '', endsAt: '', registrationUrl: '', status: 'DRAFT' };
const localDateTime = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function ManageEventsPage() {
  const client = useQueryClient();
  const [editing, setEditing] = useState<Event | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormState>(blank);
  const [formError, setFormError] = useState('');
  const [workingId, setWorkingId] = useState('');
  const query = useQuery({ queryKey: ['managed-events', page], queryFn: () => api<EventsResponse>(`/events/manage?page=${page}&limit=12`) });
  const events = query.data?.data.events ?? [];

  const startEdit = (event: Event) => {
    setEditing(event);
    setForm({ title: event.title, description: event.description ?? '', imageUrl: event.imageUrl ?? '', location: event.location ?? '', startsAt: localDateTime(event.startsAt), endsAt: localDateTime(event.endsAt), registrationUrl: event.registrationUrl ?? '', status: event.status });
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { setEditing(null); setForm(blank); setFormError(''); };
  const field = (name: keyof FormState, value: string) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setFormError('');
    if (!form.startsAt) { setFormError('Choose a start date and time.'); return; }
    if (form.endsAt && new Date(form.endsAt) < new Date(form.startsAt)) { setFormError('End time must be on or after the start time.'); return; }
    const body = {
      title: form.title, description: form.description, imageUrl: form.imageUrl, location: form.location,
      startsAt: new Date(form.startsAt).toISOString(), endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      registrationUrl: form.registrationUrl, ...(!editing ? { status: form.status } : {}),
    };
    try {
      if (editing) await api<EventResponse>(`/events/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      else await api<EventResponse>('/events', { method: 'POST', body: JSON.stringify(body) });
      await Promise.all([client.invalidateQueries({ queryKey: ['managed-events'] }), client.invalidateQueries({ queryKey: ['events'] })]);
      reset();
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Unable to save this event.'); }
  };
  const changeStatus = async (event: Event, status: EventStatus) => {
    setWorkingId(event.id); setFormError('');
    try {
      await api<EventResponse>(`/events/${event.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await Promise.all([client.invalidateQueries({ queryKey: ['managed-events'] }), client.invalidateQueries({ queryKey: ['events'] }), client.invalidateQueries({ queryKey: ['event-detail', event.id] })]);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Unable to change event status.'); }
    finally { setWorkingId(''); }
  };

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 hover:text-black"><ArrowLeft size={16} /> Content studio</Link>
    <div className="mt-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">Event calendar</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Manage events</h1><p className="mt-3 text-sm text-black/50">Create public event pages and keep their details current.</p></div>

    <form onSubmit={submit} className="mt-8 grid gap-4 rounded-[26px] border border-black/[0.07] bg-white p-5 sm:grid-cols-2 sm:p-7">
      <div className="sm:col-span-2 flex items-center justify-between"><h2 className="text-xl font-semibold">{editing ? 'Edit event' : 'Add an event'}</h2>{editing && <button type="button" onClick={reset} className="text-sm underline">Cancel edit</button>}</div>
      <label className="text-sm font-medium">Title<input required maxLength={200} value={form.title} onChange={(e) => field('title', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      <label className="text-sm font-medium">Location<input maxLength={300} value={form.location} onChange={(e) => field('location', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      <label className="text-sm font-medium">Start date and time<input required type="datetime-local" value={form.startsAt} onChange={(e) => field('startsAt', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      <label className="text-sm font-medium">End date and time<input type="datetime-local" value={form.endsAt} min={form.startsAt || undefined} onChange={(e) => field('endsAt', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      <label className="text-sm font-medium">Image URL<input type="url" value={form.imageUrl} onChange={(e) => field('imageUrl', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      <label className="text-sm font-medium">Registration URL<input type="url" value={form.registrationUrl} onChange={(e) => field('registrationUrl', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      <label className="text-sm font-medium sm:col-span-2">Description<textarea rows={4} maxLength={5000} value={form.description} onChange={(e) => field('description', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-3 font-normal" /></label>
      {!editing && <label className="text-sm font-medium">Status<select value={form.status} onChange={(e) => field('status', e.target.value)} className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-3">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>}
      {formError && <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <div className="flex gap-2 sm:col-span-2"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"><Plus size={16} />{editing ? 'Save changes' : 'Create event'}</button>{editing && <button type="button" onClick={reset} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Cancel</button>}</div>
    </form>

    {query.isLoading && <p className="mt-8 text-sm text-black/50">Loading events…</p>}
    {query.isError && <p role="alert" className="mt-8 rounded-2xl bg-red-50 p-5 text-sm text-red-700">Unable to load events. Sign in with an editor or admin account, then try again.</p>}
    {!query.isLoading && !query.isError && events.length === 0 && <div className="mt-8 rounded-[26px] bg-white p-10 text-center"><CalendarDays className="mx-auto text-black/25" /><p className="mt-3 font-medium">No events yet</p><p className="mt-1 text-sm text-black/45">Create your first event above.</p></div>}
    <div className="mt-6 space-y-4">{events.map((event) => <article key={event.id} className="grid gap-4 rounded-[26px] border border-black/[0.07] bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{event.title}</h2><span className="rounded-full bg-[#f2f0eb] px-3 py-1 text-xs">{event.status}</span></div><p className="mt-1 text-sm text-black/50">{new Date(event.startsAt).toLocaleString()}{event.location ? ` · ${event.location}` : ''}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => startEdit(event)} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold"><Pencil size={14} /> Edit</button><select aria-label={`Change ${event.title} status`} disabled={workingId === event.id} value={event.status} onChange={(e) => void changeStatus(event, e.target.value as EventStatus)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs">{statuses.map((status) => <option key={status}>{status}</option>)}</select>{event.status !== 'DRAFT' && event.status !== 'CANCELLED' && <Link href={`/events/${event.id}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold">View public page</Link>}</div></article>)}</div>
    {query.data && query.data.data.pagination.totalPages > 1 && <div className="mt-7 flex items-center justify-between"><p className="text-sm text-black/50">{query.data.data.pagination.total} events · Page {page} of {query.data.data.pagination.totalPages}</p><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40">Previous</button><button type="button" disabled={!query.data.data.pagination.hasNextPage} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40">Next</button></div></div>}
  </main>;
}

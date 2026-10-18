'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CopyPlus, Disc3, ExternalLink, Pencil, Plus, Search } from 'lucide-react';

import { api } from '@/lib/api';
import type { MusicRelease, ReleaseStatus, ReleaseType } from '@/types/music';

type ManagedReleasesResponse = {
  success: boolean;
  data: {
    releases: MusicRelease[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
    };
  };
};

type ReleaseResponse = {
  success: boolean;
  data: { release: MusicRelease };
};

const statuses: Array<{ value: ReleaseStatus | ''; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published / scheduled' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const releaseTypes: Array<{ value: ReleaseType | ''; label: string }> = [
  { value: '', label: 'All types' },
  { value: 'SINGLE', label: 'Single' },
  { value: 'EP', label: 'EP' },
  { value: 'ALBUM', label: 'Album' },
];

export default function ManageMusicPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ReleaseStatus | ''>('');
  const [type, setType] = useState<ReleaseType | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['managed-music', { search, status, type, dateFrom, dateTo, page }],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (type) params.set('type', type);
      if (dateFrom) params.set('dateFrom', new Date(`${dateFrom}T00:00:00`).toISOString());
      if (dateTo) params.set('dateTo', new Date(`${dateTo}T23:59:59.999`).toISOString());
      return api<ManagedReleasesResponse>(`/music/manage?${params.toString()}`);
    },
  });

  const applyFilters = (changes: Partial<{
    search: string;
    status: ReleaseStatus | '';
    type: ReleaseType | '';
    dateFrom: string;
    dateTo: string;
  }>) => {
    setPage(1);
    if ('search' in changes) setSearch(changes.search ?? '');
    if ('status' in changes) setStatus(changes.status ?? '');
    if ('type' in changes) setType(changes.type ?? '');
    if ('dateFrom' in changes) setDateFrom(changes.dateFrom ?? '');
    if ('dateTo' in changes) setDateTo(changes.dateTo ?? '');
  };

  const mutateRelease = async (
    release: MusicRelease,
    action: 'duplicate' | 'status',
    nextStatus?: ReleaseStatus,
  ) => {
    setActionError(null);
    setWorkingId(release.id);
    try {
      if (action === 'duplicate') {
        await api<ReleaseResponse>(`/music/${release.id}/duplicate`, { method: 'POST' });
      } else {
        await api<ReleaseResponse>(`/music/${release.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus }),
        });
      }
      await queryClient.invalidateQueries({ queryKey: ['managed-music'] });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update this release.');
    } finally {
      setWorkingId(null);
    }
  };

  const releases = query.data?.data.releases ?? [];
  const pagination = query.data?.data.pagination;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 hover:text-black">
        <ArrowLeft size={16} /> Content studio
      </Link>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">Music catalogue</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Manage releases</h1>
          <p className="mt-3 text-sm text-black/50">Search, preview, schedule, publish, edit, duplicate, or archive releases.</p>
        </div>
        <Link href="/admin/music/new" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
          <Plus size={16} /> Add release
        </Link>
      </div>

      <form
        className="mt-8 grid gap-3 rounded-[26px] border border-black/[0.07] bg-white p-4 sm:grid-cols-2 lg:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters({ search: searchInput.trim() });
        }}
      >
        <label className="relative sm:col-span-2 lg:col-span-2">
          <span className="sr-only">Search title or artist</span>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full rounded-xl border border-black/10 py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
            placeholder="Search title or artist"
          />
        </label>
        <button type="submit" className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/[0.04]">Search</button>
        <select aria-label="Filter by status" value={status} onChange={(event) => applyFilters({ status: event.target.value as ReleaseStatus | '' })} className="rounded-xl border border-black/10 bg-white px-3 py-3 text-sm">
          {statuses.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <select aria-label="Filter by release type" value={type} onChange={(event) => applyFilters({ type: event.target.value as ReleaseType | '' })} className="rounded-xl border border-black/10 bg-white px-3 py-3 text-sm">
          {releaseTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <label className="text-xs text-black/50">From<input aria-label="Release date from" type="date" value={dateFrom} onChange={(event) => applyFilters({ dateFrom: event.target.value })} className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black" /></label>
        <label className="text-xs text-black/50">To<input aria-label="Release date to" type="date" value={dateTo} onChange={(event) => applyFilters({ dateTo: event.target.value })} className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black" /></label>
      </form>

      {actionError && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{actionError}</p>}
      {query.isLoading && <p className="mt-8 text-sm text-black/50">Loading releases…</p>}
      {query.isError && (
        <div role="alert" className="mt-8 rounded-2xl bg-red-50 p-6 text-sm text-red-700">
          Unable to load releases. Please sign in with an authorized content manager account and try again.
          <Link href="/admin/login" className="ml-2 font-semibold underline">Sign in</Link>
        </div>
      )}
      {!query.isLoading && !query.isError && releases.length === 0 && (
        <div className="mt-8 rounded-[26px] bg-white p-10 text-center">
          <Disc3 className="mx-auto text-black/25" />
          <p className="mt-3 font-medium">No releases match these filters.</p>
          <p className="mt-1 text-sm text-black/45">Try a different search or add a release.</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {releases.map((release) => {
          const scheduled = release.status === 'PUBLISHED' && new Date(release.releaseDate) > new Date();
          const nextStatus: ReleaseStatus = release.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
          return (
            <article key={release.id} className="grid gap-4 rounded-[26px] border border-black/[0.07] bg-white p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
              <div className="aspect-square overflow-hidden rounded-2xl bg-[#f2f0eb]">
                {release.coverUrl ? <img src={release.coverUrl} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center"><Disc3 className="text-black/25" /></div>}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold">{release.title}</h2>
                  <span className="rounded-full bg-[#f2f0eb] px-3 py-1 text-xs font-medium">{scheduled ? 'Scheduled' : release.status.toLowerCase()}</span>
                  {release.isFeatured && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">Featured</span>}
                </div>
                <p className="mt-1 text-sm text-black/55">{release.artistName} · {release.type} · {release.tracks.length} track(s)</p>
                <p className="mt-1 text-xs text-black/40">
                  {new Date(release.releaseDate).toLocaleString()}
                  {release.links.length > 0 && ` · ${release.links.length} listening link(s)`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/music/${release.id}/edit`} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-black/[0.04]"><Pencil size={14} /> Edit</Link>
                <button type="button" disabled={workingId === release.id} onClick={() => mutateRelease(release, 'duplicate')} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-black/[0.04] disabled:opacity-50"><CopyPlus size={14} /> Duplicate</button>
                {release.status !== 'ARCHIVED' && (
                  <button type="button" disabled={workingId === release.id} onClick={() => mutateRelease(release, 'status', nextStatus)} className="rounded-full bg-black px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
                    {release.status === 'PUBLISHED' ? 'Unpublish' : 'Publish / schedule'}
                  </button>
                )}
                <button type="button" disabled={workingId === release.id} onClick={() => mutateRelease(release, 'status', release.status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED')} className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-black/[0.04] disabled:opacity-50">
                  {release.status === 'ARCHIVED' ? 'Restore draft' : 'Archive'}
                </button>
                {release.status === 'PUBLISHED' && !scheduled && (
                  <Link href={`/music/${release.id}`} target="_blank" className="grid size-9 place-items-center rounded-full border border-black/10 hover:bg-black/[0.04]" aria-label={`Open ${release.title} public page`}><ExternalLink size={14} /></Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-black/50">{pagination.total} releases · Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
            <button type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </main>
  );
}

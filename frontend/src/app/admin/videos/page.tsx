'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Search, Video } from 'lucide-react';

import { api } from '@/lib/api';
import type { Video as ManagedVideo } from '@/types/video';

type ManagedVideosResponse = {
  success: boolean;
  data: {
    videos: ManagedVideo[];
    categories: string[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
  };
};

type VideoResponse = { success: boolean; data: { video: ManagedVideo } };
type Status = ManagedVideo['status'] | '';

const statusOptions: Array<{ value: Status; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function ManageVideosPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status>('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['managed-videos', { search, status, category, page }],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (category) params.set('category', category);
      return api<ManagedVideosResponse>(`/videos/manage?${params.toString()}`);
    },
  });

  const setFilter = (update: () => void) => {
    setPage(1);
    update();
  };

  const updateStatus = async (video: ManagedVideo, nextStatus: ManagedVideo['status']) => {
    setActionError(null);
    setActionSuccess(null);
    setWorkingId(video.id);
    try {
      await api<VideoResponse>(`/videos/${video.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setActionSuccess(
        nextStatus === 'DRAFT'
          ? `“${video.title}” is unpublished and hidden from the public videos page.`
          : nextStatus === 'PUBLISHED'
            ? `“${video.title}” is now published.`
            : nextStatus === 'ARCHIVED'
              ? `“${video.title}” has been archived.`
              : `“${video.title}” has been updated.`,
      );
      await queryClient.invalidateQueries({ queryKey: ['managed-videos'] });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'Unable to update this video.';
      setActionError(`Could not update “${video.title}”: ${message}`);
    } finally {
      setWorkingId(null);
    }
  };

  const videos = query.data?.data.videos ?? [];
  const pagination = query.data?.data.pagination;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 hover:text-black">
        <ArrowLeft size={16} /> Content studio
      </Link>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">Video catalogue</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Manage videos</h1>
          <p className="mt-3 text-sm text-black/50">Find videos, change their visibility, and organize the catalogue.</p>
        </div>
        <Link href="/admin/videos/new" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">Add YouTube video</Link>
      </div>

      <form
        className="mt-8 grid gap-3 rounded-[26px] border border-black/[0.07] bg-white p-4 sm:grid-cols-[1fr_auto_1fr]"
        onSubmit={(event) => { event.preventDefault(); setFilter(() => setSearch(searchInput.trim())); }}
      >
        <label className="relative">
          <span className="sr-only">Search video titles</span>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search video titles" className="w-full rounded-xl border border-black/10 py-3 pl-10 pr-4 text-sm outline-none focus:border-black" />
        </label>
        <button type="submit" className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.04]">Search</button>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sr-only" htmlFor="video-status">Filter by status</label>
          <select id="video-status" value={status} onChange={(event) => setFilter(() => setStatus(event.target.value as Status))} className="rounded-xl border border-black/10 bg-white px-3 py-3 text-sm">
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="video-category">Filter by category</label>
          <select id="video-category" value={category} onChange={(event) => setFilter(() => setCategory(event.target.value))} className="rounded-xl border border-black/10 bg-white px-3 py-3 text-sm">
            <option value="">All categories</option>
            {(query.data?.data.categories ?? []).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </form>

      {actionError && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{actionError}</p>}
      {actionSuccess && <p role="status" aria-live="polite" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">{actionSuccess}</p>}
      {query.isLoading && <p className="mt-8 text-sm text-black/50">Loading videos…</p>}
      {query.isError && <div role="alert" className="mt-8 rounded-2xl bg-red-50 p-6 text-sm text-red-700">Unable to load videos. Sign in with an authorized content manager account and try again.<Link href="/admin/login" className="ml-2 font-semibold underline">Sign in</Link></div>}
      {!query.isLoading && !query.isError && videos.length === 0 && (
        <div className="mt-8 rounded-[26px] bg-white p-10 text-center">
          <Video className="mx-auto text-black/25" />
          <p className="mt-3 font-medium">No videos match these filters.</p>
          <p className="mt-1 text-sm text-black/45">Try another search or add a video from the official channel.</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {videos.map((video) => (
          <article key={video.id} className="grid gap-4 rounded-[26px] border border-black/[0.07] bg-white p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center">
            <a href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`} target="_blank" rel="noreferrer" className="relative aspect-video overflow-hidden rounded-2xl bg-[#f2f0eb]" aria-label={`Watch ${video.title} on YouTube`}>
              {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center"><Video className="text-black/30" /></span>}
            </a>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{video.title}</h2>
                <span className="rounded-full bg-[#f2f0eb] px-3 py-1 text-xs font-medium">{video.status.toLowerCase()}</span>
              </div>
              <p className="mt-1 text-sm text-black/55">{video.category}{video.channelTitle ? ` · ${video.channelTitle}` : ''}</p>
              <p className="mt-1 text-xs text-black/40">{video.sourcePublishedAt ? `YouTube · ${new Date(video.sourcePublishedAt).toLocaleDateString()}` : 'YouTube source'}{video.updatedAt ? ` · Updated ${new Date(video.updatedAt).toLocaleDateString()}` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {video.status !== 'ARCHIVED' && (
                <button type="button" disabled={workingId === video.id} onClick={() => updateStatus(video, video.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')} className="rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">
                  {workingId === video.id ? (video.status === 'PUBLISHED' ? 'Unpublishing…' : 'Publishing…') : (video.status === 'PUBLISHED' ? 'Unpublish' : 'Publish')}
                </button>
              )}
              <button type="button" disabled={workingId === video.id} onClick={() => updateStatus(video, video.status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED')} className="rounded-full border border-black/10 px-4 py-2.5 text-xs font-semibold hover:bg-black/[0.04] disabled:opacity-50">
                {video.status === 'ARCHIVED' ? 'Restore draft' : 'Archive'}
              </button>
              {video.status === 'PUBLISHED' && <Link href={`/videos/${video.id}`} target="_blank" aria-label={`Open ${video.title} public page`} className="grid size-9 place-items-center rounded-full border border-black/10 hover:bg-black/[0.04]"><ExternalLink size={14} /></Link>}
            </div>
          </article>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-black/50">{pagination.total} videos · Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
            <button type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-black/10 px-4 py-2 text-sm disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </main>
  );
}

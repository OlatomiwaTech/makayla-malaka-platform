'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

import { AdminMusicReleaseForm } from '@/components/music/admin-release-form';
import { api } from '@/lib/api';
import type { MusicRelease } from '@/types/music';

type ReleaseResponse = {
  success: boolean;
  data: { release: MusicRelease };
};

export default function EditMusicReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const query = useQuery({
    queryKey: ['managed-music-release', id],
    queryFn: () => api<ReleaseResponse>(`/music/manage/${id}`),
  });

  if (query.isLoading) {
    return <main className="mx-auto max-w-4xl px-4 py-10">Loading release…</main>;
  }

  if (query.isError || !query.data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Unable to load this release</h1>
        <p className="mt-2 text-sm text-black/50">
          Sign in with a content manager account, or return to the release manager.
        </p>
        <Link href="/admin/music" className="mt-5 inline-block underline">
          Back to releases
        </Link>
      </main>
    );
  }

  return <AdminMusicReleaseForm release={query.data.data.release} />;
}

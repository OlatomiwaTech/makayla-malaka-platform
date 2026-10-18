import Link from 'next/link';
import { ArrowUpRight, Disc3, ListMusic, UsersRound, Video } from 'lucide-react';

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          Makayla Malaka
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
          Content studio
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
          Add and publish music releases and videos to the public catalogues.
        </p>
        <Link
          href="/admin/login"
          className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
        >
          Sign in with an editor or admin account
        </Link>
        <Link
          href="/admin/setup"
          className="ml-5 mt-4 inline-flex text-sm font-medium text-black/55 underline underline-offset-4 hover:text-black"
        >
          First-time owner setup
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/music/new"
          className="group rounded-[28px] border border-black/[0.07] bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f2f0eb]">
              <Disc3 size={22} />
            </span>
            <ArrowUpRight className="text-black/35 transition group-hover:text-black" size={20} />
          </div>
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
            Add a music release
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/50">
            Create a single, EP, or album with tracks, artwork, and listening links.
          </p>
        </Link>

        <Link
          href="/admin/music"
          className="group rounded-[28px] border border-black/[0.07] bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f2f0eb]">
              <ListMusic size={22} />
            </span>
            <ArrowUpRight className="text-black/35 transition group-hover:text-black" size={20} />
          </div>
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
            Manage music releases
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/50">
            Review drafts and scheduled releases, search the catalogue, and edit or archive published music.
          </p>
        </Link>

        <Link
          href="/admin/videos/new"
          className="group rounded-[28px] border border-black/[0.07] bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f2f0eb]">
              <Video size={22} />
            </span>
            <ArrowUpRight className="text-black/35 transition group-hover:text-black" size={20} />
          </div>
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
            Add a YouTube video
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/50">
            Add a video from Makayla&apos;s official YouTube channel.
          </p>
        </Link>

        <Link
          href="/admin/accounts"
          className="group rounded-[28px] border border-black/[0.07] bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f2f0eb]">
              <UsersRound size={22} />
            </span>
            <ArrowUpRight className="text-black/35 transition group-hover:text-black" size={20} />
          </div>
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
            Manage accounts
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/50">
            Grant or revoke music and video access for registered accounts.
          </p>
        </Link>
      </div>
    </main>
  );
}

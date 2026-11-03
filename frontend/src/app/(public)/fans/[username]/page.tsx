'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { usePublicProfile } from '@/hooks/use-profile';

const errorStatus = (error: unknown) =>
  typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
    ? error.status
    : null;

export default function PublicFanProfilePage() {
  const { username } = useParams<{ username: string }>();
  const query = usePublicProfile(username);
  const profile = query.data?.profile;

  if (query.isPending) {
    return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><div className="h-64 animate-pulse rounded-3xl bg-[#f4e9dc]" aria-label="Loading fan profile" /></main>;
  }

  if (query.isError || !profile) {
    const profileNotFound = errorStatus(query.error) === 404;

    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-3xl text-[#542c28]">{profileNotFound ? 'Profile not found' : 'Profile unavailable'}</h1>
        <p role={profileNotFound ? undefined : 'alert'} className="mt-3 text-sm text-[#654b44]/65">{profileNotFound ? 'This fan profile may have been removed or is no longer public.' : 'We couldn’t load this profile. Please try again.'}</p>
        {profileNotFound
          ? <Link href="/community" className="mt-6 inline-block rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white">Back to community</Link>
          : <button type="button" onClick={() => void query.refetch()} className="mt-6 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white">Try again</button>}
      </main>
    );
  }

  const displayName = profile.profile?.displayName || profile.username;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="rounded-[2rem] border border-[#8b4a35]/10 bg-white p-7 text-center shadow-sm sm:p-12">
        {profile.profile?.avatarUrl ? (
          <Image src={profile.profile.avatarUrl} alt="" width={96} height={96} unoptimized className="mx-auto size-24 rounded-full object-cover" />
        ) : (
          <div aria-hidden="true" className="mx-auto grid size-24 place-items-center rounded-full bg-[#f7e8d8] font-serif text-4xl text-[#8d344b]">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a6538]">Makayla Malaka community</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.045em] text-[#542c28]">{displayName}</h1>
        <p className="mt-2 text-sm text-[#654b44]/55">@{profile.username}</p>
        {profile.profile?.bio && <p className="mx-auto mt-6 max-w-lg whitespace-pre-wrap text-base leading-7 text-[#654b44]/75">{profile.profile.bio}</p>}
        {profile.profile?.createdAt && <p className="mt-8 text-xs text-[#654b44]/45">Joined {new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(profile.profile.createdAt))}</p>}
        <Link href="/community" className="mt-8 inline-flex rounded-full border border-[#8b4a35]/20 px-5 py-3 text-sm font-semibold text-[#542c28] transition hover:bg-[#fff3e4]">Explore the community</Link>
      </section>
    </main>
  );
}

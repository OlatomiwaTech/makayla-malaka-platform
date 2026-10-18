import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Disc3 } from 'lucide-react';

import type { MusicRelease } from '@/types/music';

type ReleaseCardProps = {
  release: MusicRelease;
};

const releaseDateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));

export function ReleaseCard({
  release,
}: ReleaseCardProps) {
  return (
    <Link
      href={`/music/${release.id}`}
      aria-label={`View ${release.title} by ${release.artistName}, ${release.type.toLowerCase()}, ${release.tracks.length} ${release.tracks.length === 1 ? 'track' : 'tracks'}`}
      className="group block rounded-[26px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8d344b]"
    >
      <div className="relative aspect-square overflow-hidden rounded-[26px] bg-[#e8e5df]">
        {release.coverUrl ? (
          <Image
            src={release.coverUrl}
            alt={`${release.title} cover`}
            fill
            unoptimized
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col justify-between bg-[#1a1a1a] p-6 text-white">
            <Disc3 size={24} className="text-white/35" />

            <span className="text-3xl font-semibold tracking-[-0.05em]">
              M
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold tracking-[-0.02em]">
            {release.title}
          </h3>

          <p className="mt-1 text-sm text-black/55">
            {release.artistName} · {release.type === 'EP' ? 'EP' : release.type.toLowerCase()}
          </p>
          <time dateTime={release.releaseDate} className="mt-1 block text-xs text-black/40">
            {releaseDateLabel(release.releaseDate)} · {release.tracks.length} {release.tracks.length === 1 ? 'track' : 'tracks'}
          </time>
        </div>

        <ArrowUpRight
          size={17}
          className="mt-1 text-black/35 transition group-hover:text-black"
        />
      </div>
    </Link>
  );
}

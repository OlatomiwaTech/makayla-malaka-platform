import Link from 'next/link';
import { ArrowUpRight, Disc3 } from 'lucide-react';

import type { MusicRelease } from '@/types/music';

type ReleaseCardProps = {
  release: MusicRelease;
};

export function ReleaseCard({
  release,
}: ReleaseCardProps) {
  return (
    <Link
      href={`/music/${release.id}`}
      className="group block"
    >
      <div className="aspect-square overflow-hidden rounded-[26px] bg-[#e8e5df]">
        {release.coverUrl ? (
          <img
            src={release.coverUrl}
            alt={`${release.title} cover`}
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
        <div>
          <h3 className="font-semibold tracking-[-0.02em]">
            {release.title}
          </h3>

          <p className="mt-1 text-sm text-black/45">
            {release.type} ·{' '}
            {new Date(
              release.releaseDate,
            ).getFullYear()}
          </p>
        </div>

        <ArrowUpRight
          size={17}
          className="mt-1 text-black/35 transition group-hover:text-black"
        />
      </div>
    </Link>
  );
}

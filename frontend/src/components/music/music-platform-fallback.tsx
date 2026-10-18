import { ArrowUpRight, Music2 } from 'lucide-react';

const platforms = [
  { label: 'Spotify', href: 'https://open.spotify.com/artist/3zIEv4MJeehBetiqKZ5Ugt' },
  { label: 'Apple Music', href: 'https://music.apple.com/ng/artist/makayla-malaka/1515047857' },
];

export function MusicPlatformFallback({ unavailable = false }: { unavailable?: boolean }) {
  return (
    <div className="rounded-3xl border border-[#8b4a35]/10 bg-white p-6 shadow-sm sm:p-8">
      <span className="grid size-11 place-items-center rounded-2xl bg-[#f7e8d8] text-[#8d344b]"><Music2 size={20} aria-hidden="true" /></span>
      <h3 className="mt-4 font-serif text-2xl text-[#542c28]">Listen to Makayla</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#654b44]/70">
        {unavailable
          ? 'The music catalogue is taking a little longer to load. You can still find Makayla’s music on her official artist pages.'
          : 'New releases will appear in this catalogue. In the meantime, explore Makayla’s music on her official artist pages.'}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <a key={platform.href} href={platform.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d]">
            Listen on {platform.label}<ArrowUpRight size={15} />
          </a>
        ))}
      </div>
    </div>
  );
}

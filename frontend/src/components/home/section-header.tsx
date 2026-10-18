import Link from 'next/link';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  href?: string;
  tone?: 'default' | 'brand';
};

export function SectionHeader({
  eyebrow,
  title,
  href,
  tone = 'default',
}: SectionHeaderProps) {
  const brand = tone === 'brand';

  return (
    <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${brand ? 'text-[#c30c6c]' : 'text-[#b64d60]'}`}>
          {eyebrow}
        </p>

        <h2 className={`mt-2 font-serif text-3xl font-medium tracking-[-0.035em] sm:text-4xl ${brand ? 'text-[#111]' : 'text-[#542c28]'}`}>
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 ${brand ? 'border-black/15 bg-white text-[#111] hover:border-[#ed1689] hover:text-[#c30c6c] focus-visible:outline-[#ed1689]' : 'border-[#8b4a35]/15 bg-white/70 text-[#8d344b] hover:bg-white focus-visible:outline-[#8d344b]'}`}
        >
          See all →
        </Link>
      )}
    </div>
  );
}

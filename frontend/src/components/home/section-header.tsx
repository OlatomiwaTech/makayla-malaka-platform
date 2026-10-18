import Link from 'next/link';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  href?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  href,
}: SectionHeaderProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b64d60]">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-serif text-3xl font-medium tracking-[-0.035em] text-[#542c28] sm:text-4xl">
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="rounded-full border border-[#8b4a35]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#8d344b] transition hover:bg-white"
        >
          See all →
        </Link>
      )}
    </div>
  );
}

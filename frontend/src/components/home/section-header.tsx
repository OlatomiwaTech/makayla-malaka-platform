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
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="text-sm font-semibold text-black/55 transition hover:text-black"
        >
          See all →
        </Link>
      )}
    </div>
  );
}

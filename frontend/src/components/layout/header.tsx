import Link from 'next/link';
import { Bell, Search } from 'lucide-react';

const links = [
	{ href: '/', label: 'Home' },
	{ href: '/music', label: 'Music' },
	{ href: '/videos', label: 'Videos' },
	{ href: '/events', label: 'Events' },
	{ href: '/community', label: 'Community' },
];

export function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f5f1]/90 backdrop-blur-xl">
			<div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
				<Link
					href="/"
					className="text-[20px] font-semibold tracking-[-0.04em]"
				>
					Makayla
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-black/55 transition-colors hover:text-black"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<button
						type="button"
						aria-label="Search"
						className="grid size-10 place-items-center rounded-full transition hover:bg-black/[0.06]"
					>
						<Search size={19} strokeWidth={1.8} />
					</button>

					<button
						type="button"
						aria-label="Notifications"
						className="grid size-10 place-items-center rounded-full transition hover:bg-black/[0.06]"
					>
						<Bell size={19} strokeWidth={1.8} />
					</button>

					<button
						type="button"
						aria-label="Profile"
						className="ml-1 grid size-9 place-items-center rounded-full bg-black text-xs font-semibold text-white"
					>
						M
					</button>
				</div>
			</div>
		</header>
	);
}

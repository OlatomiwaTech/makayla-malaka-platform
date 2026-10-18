import Image from 'next/image';
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
		<header className="sticky top-0 z-50 bg-[#fffaf3]/90 backdrop-blur-xl">
			<div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 lg:px-8">
				<div className="flex h-[68px] items-center justify-between rounded-[1.5rem] border border-[#8b4a35]/10 bg-[#fffaf3]/95 px-4 shadow-[0_8px_28px_-22px_rgba(84,44,40,0.55)] sm:px-6">
					<Link
						href="/"
						className="flex items-center gap-2.5 rounded-full pr-2 text-[20px] font-semibold tracking-[-0.04em] text-[#542c28]"
					>
						<Image
							src="/Logo.png"
							alt=""
							width={36}
							height={36}
							priority
							className="size-9 object-contain"
						/>
						<span className="leading-none">
							Makayla<span className="ml-1 text-[#b64d60]">.</span>
							<span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b4a35]/55">
								Official home
							</span>
						</span>
					</Link>

					<nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full bg-[#f7e8d8]/75 p-1 md:flex">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="rounded-full px-4 py-2 text-sm font-medium text-[#654b44]/75 transition-colors hover:bg-white hover:text-[#8d344b]"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label="Search"
							className="grid size-10 place-items-center rounded-full bg-[#f7e8d8]/75 text-[#654b44] transition hover:bg-[#f8d8bd] hover:text-[#8d344b]"
						>
							<Search size={19} strokeWidth={1.8} />
						</button>

						<button
							type="button"
							aria-label="Notifications"
							className="grid size-10 place-items-center rounded-full bg-[#f7e8d8]/75 text-[#654b44] transition hover:bg-[#f8d8bd] hover:text-[#8d344b]"
						>
							<Bell size={19} strokeWidth={1.8} />
						</button>

						<button
							type="button"
							aria-label="Profile"
							className="ml-1 grid size-9 place-items-center rounded-full bg-[#8d344b] text-xs font-semibold text-white shadow-sm shadow-[#8d344b]/20"
						>
							M
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}

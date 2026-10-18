'use client';

import Link from 'next/link';
import {
	CalendarDays,
	Home,
	Music2,
	Users,
	Video,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const links = [
	{
		href: '/',
		label: 'Home',
		icon: Home,
	},
	{
		href: '/music',
		label: 'Music',
		icon: Music2,
	},
	{
		href: '/videos',
		label: 'Videos',
		icon: Video,
	},
	{
		href: '/events',
		label: 'Events',
		icon: CalendarDays,
	},
	{
		href: '/community',
		label: 'Community',
		icon: Users,
	},
];

export function BottomNav() {
	const pathname = usePathname();

	return (
		<nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 rounded-[1.4rem] border border-[#8b4a35]/10 bg-[#fffaf3]/95 shadow-[0_12px_36px_-18px_rgba(84,44,40,0.35)] backdrop-blur-xl md:hidden">
			<div className="mx-auto flex max-w-md justify-around px-1.5 py-1.5">
				{links.map((link) => {
					const Icon = link.icon;
					const active = pathname === link.href;

					return (
						<Link
							key={link.href}
							href={link.href}
							className={`flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] transition-colors ${
								active
									? 'bg-[#f7e8d8] font-semibold text-[#8d344b]'
									: 'text-[#654b44]/65 hover:bg-white/80 hover:text-[#8d344b]'
							}`}
						>
							<Icon size={19} />
							<span>{link.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

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
		<nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur-md md:hidden">
			<div className="mx-auto flex max-w-md justify-around px-2 py-2">
				{links.map((link) => {
					const Icon = link.icon;
					const active = pathname === link.href;

					return (
						<Link
							key={link.href}
							href={link.href}
							className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs ${
								active
									? 'font-medium text-black'
									: 'text-zinc-500'
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

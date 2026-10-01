import Link from 'next/link';
import { Bell, Search } from 'lucide-react';

export function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
				<Link
					href="/"
					className="text-lg font-semibold tracking-tight"
				>
					Makayla
				</Link>

				<div className="flex items-center gap-1">
					<button
						type="button"
						aria-label="Search"
						className="rounded-full p-2 transition hover:bg-black/5"
					>
						<Search size={20} />
					</button>

					<button
						type="button"
						aria-label="Notifications"
						className="rounded-full p-2 transition hover:bg-black/5"
					>
						<Bell size={20} />
					</button>
				</div>
			</div>
		</header>
	);
}

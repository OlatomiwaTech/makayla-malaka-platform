'use client';

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

import { ReactNode, useState } from 'react';

type ProvidersProps = {
	children: ReactNode;
};

export default function Providers({
	children,
}: ProvidersProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30_000,
						retry: 4,
						retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 4_000),
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

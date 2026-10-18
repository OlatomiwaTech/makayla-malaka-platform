import type { Metadata } from 'next';

import { SearchExperience } from '@/components/search/search-experience';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Makayla Malaka’s music, videos and updates.',
};

export default function SearchPage() {
  return <SearchExperience />;
}

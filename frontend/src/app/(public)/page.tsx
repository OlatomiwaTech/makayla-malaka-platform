import type { Metadata } from 'next';

import { HomeExperience } from '@/components/home/home-experience';

export const metadata: Metadata = {
  title: 'Official Website',
  description:
    'Visit the official Makayla Malaka website for new music, official videos, news, events, and updates from the artist.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Makayla Malaka | Official Website',
    description:
      'New music, official videos, news, events, and updates from artist Makayla Malaka.',
    url: '/',
    images: [
      {
        url: '/Logo.png',
        width: 512,
        height: 512,
        alt: 'Makayla Malaka official website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Makayla Malaka | Official Website',
    description:
      'New music, official videos, news, events, and updates from artist Makayla Malaka.',
    images: ['/Logo.png'],
  },
};

export default function HomePage() {
  return <HomeExperience />;
}
import type { Metadata } from 'next';

import './globals.css';

import Providers from './providers';

export const metadata: Metadata = {
  title: 'Makayla Malaka',
  description:
    'The official digital home for Makayla Malaka.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

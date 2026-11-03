import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fan profile',
  robots: { index: false, follow: false, noarchive: true },
};

export default function FanProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

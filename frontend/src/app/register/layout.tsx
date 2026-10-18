import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an account',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

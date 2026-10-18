import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { canonicalUrl, jsonLd } from '@/lib/seo';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Makayla Malaka',
    url: canonicalUrl('/'),
    publisher: {
      '@type': 'Person',
      name: 'Makayla Malaka',
      jobTitle: 'Recording artist',
      sameAs: [
        'https://www.youtube.com/@MakaylaSuperstar',
        'https://music.youtube.com/channel/UCNY3D79_l_o0MIAL_sOOcog',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteStructuredData)} />
      <Header />

      <main className="pb-24">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
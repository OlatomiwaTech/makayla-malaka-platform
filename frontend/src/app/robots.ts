import type { MetadataRoute } from 'next';

import { canonicalUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: canonicalUrl('/sitemap.xml'),
    host: canonicalUrl('/'),
  };
}

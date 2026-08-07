import type { MetadataRoute } from 'next';
import { profile } from '@/data/profile';

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page site: one URL. The section anchors live inside it and are not
  // separately addressable, so listing them would be lying to a crawler.
  return [
    {
      url: profile.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

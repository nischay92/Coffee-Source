import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL?.replace(/\/$/, '');
  return site
    ? { rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/shop/cart/', '/shop/order/'] }, sitemap: `${site}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}

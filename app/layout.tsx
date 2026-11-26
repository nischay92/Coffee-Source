import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import StorefrontChrome from '@/components/StorefrontChrome';
import './globals.css';

const site = process.env.SITE_URL;
const description = 'Arabica, Robusta and signature blends from Coorg, Karnataka. Explore BeanSource coffee and talk to us about bulk sourcing, private labelling and gifting.';

export const metadata: Metadata = {
  metadataBase: new URL(site || 'http://localhost:3000'),
  title: { default: 'BeanSource — Coffee from Coorg', template: '%s | BeanSource' },
  description,
  robots: { index: Boolean(site), follow: Boolean(site) },
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'BeanSource', description, images: ['/images/coffee-roasting.png'] },
  referrer: 'strict-origin-when-cross-origin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen flex flex-col">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <StorefrontChrome><Header /></StorefrontChrome>
        <main id="main-content" className="flex-grow">{children}</main>
        <StorefrontChrome><Footer /><WhatsAppButton /></StorefrontChrome>
      </body>
    </html>
  );
}

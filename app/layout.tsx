import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bean Sourced - Premium Coffee & Spice Sourcing from Coorg | Trade Facilitation Partner',
  description: 'Your trusted Coffee & Spice Sourcing Partner from Coorg, Karnataka. Connecting verified farmers and traders with bulk buyers, exporters, and importers across India and international markets. Commission-based trade facilitation.',
  keywords: 'bulk coffee supplier India, Coorg coffee sourcing, black pepper bulk supplier, spice sourcing agent India, coffee export sourcing partner, bulk spice trader India, coffee and spice sourcing Coorg, Robusta coffee, Arabica coffee, green cardamom, black pepper',
  authors: [{ name: 'Bean Sourced' }],
  creator: 'Bean Sourced',
  publisher: 'Bean Sourced',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://beansourced.com',
    siteName: 'Bean Sourced',
    title: 'Bean Sourced - Premium Coffee & Spice Sourcing from Coorg',
    description: 'Trusted trade facilitation partner connecting farmers with bulk buyers across India and international markets.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bean Sourced - Coffee & Spice Sourcing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bean Sourced - Premium Coffee & Spice Sourcing from Coorg',
    description: 'Trusted trade facilitation partner connecting farmers with bulk buyers.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8a5541" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

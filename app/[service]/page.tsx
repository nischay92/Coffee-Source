import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EnquiryForm from '@/components/EnquiryForm';
import { services } from '@/lib/content';

type Props = { params: Promise<{ service: string }> };

export function generateStaticParams() {
  return services.map(item => ({ service: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const item = services.find(entry => entry.slug === service);
  return item ? { title: item.title, description: item.short, alternates: { canonical: `/${service}` } } : {};
}

export default async function ServicePage({ params }: Props) {
  const { service } = await params;
  const item = services.find(entry => entry.slug === service);
  if (!item) notFound();
  return (
    <>
      <section className="service-hero">
        <div className="service-copy">
          <p className="eyebrow">{item.label}</p>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <a className="action" href="#enquiry">Request a quote</a>
        </div>
        <div className="service-photo"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 50vw" priority /></div>
      </section>
      <section className="site-wrap editorial-section service-form-grid" id="enquiry">
        <div>
          <h2 className="form-title">Tell us what you need.</h2>
          <ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
          {service === 'gifting' && <Link className="text-link" href="/shop/collection/coffee-gifting">Explore retail gifts</Link>}
          <p className="mt-4">Prefer email? <a className="text-link" href="mailto:info@beansource.in">info@beansource.in</a></p>
        </div>
        <EnquiryForm service={item.slug} />
      </section>
    </>
  );
}

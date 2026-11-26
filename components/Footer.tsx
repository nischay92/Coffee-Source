import Link from 'next/link';
import Image from 'next/image';
import { collections, services } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-wrap footer-grid">
        <div>
          <Link href="/" className="brand"><Image src="/images/logo-icon.png" alt="" width={48} height={48} /><span>BeanSource</span></Link>
          <p>Coorg coffee for homes, cafés and businesses.</p>
          <p>Kodagu, Karnataka, India</p>
        </div>
        <div>
          <h2>Shop</h2>
          {collections.map(item => <Link key={item.slug} href={`/shop/collection/${item.slug}`}>{item.name}</Link>)}
        </div>
        <div>
          <h2>Business</h2>
          {services.map(item => <Link key={item.slug} href={`/${item.slug}`}>{item.title}</Link>)}
        </div>
        <div>
          <h2>Get in touch</h2>
          <a href="mailto:info@beansource.in">info@beansource.in</a>
          <a href="tel:+919535044721">+91 95350 44721</a>
          <Link href="/contact">Contact BeanSource</Link>
          <Link href="/about">About us</Link>
        </div>
      </div>
      <div className="site-wrap footer-base"><span>© {new Date().getFullYear()} BeanSource</span><Link href="/how-it-works">How sourcing works</Link></div>
    </footer>
  );
}

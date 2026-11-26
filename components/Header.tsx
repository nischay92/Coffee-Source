'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

const navigation = [
  ['Home', '/'], ['Shop', '/shop'], ['Bulk Sourcing', '/bulk-sourcing'],
  ['Corporate Supply', '/corporate-supply'], ['Private Labelling', '/private-labelling'],
  ['Gifting', '/gifting'], ['About Us', '/about'], ['Contact', '/contact'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="header-inner" aria-label="Main navigation">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <Image src="/images/logo-icon.png" alt="" width={48} height={48} priority />
          <span>BeanSource</span>
        </Link>
        <div className="desktop-nav">{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
        <div className="header-tools">
          <Link className="icon-link" href="/shop#search" aria-label="Search the shop" onClick={() => setOpen(false)}><Search size={19} /></Link>
          <Link className="icon-link" href="/shop/cart" aria-label="Shopping bag" onClick={() => setOpen(false)}><ShoppingBag size={19} /></Link>
          <button type="button" className="icon-link menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>
      {open && <div className="mobile-nav" id="mobile-navigation">
        {navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      </div>}
    </header>
  );
}

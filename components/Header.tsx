'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Coffee, ChevronDown } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'For Buyers', href: '/for-buyers' },
  { name: 'For Suppliers', href: '/for-suppliers' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom" aria-label="Global">
        <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <div className="flex items-center justify-center w-10 h-10 bg-coffee-700 rounded-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-bold text-gray-900">Coorg</span>
              <span className="font-serif text-xl font-bold text-coffee-700">Source</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-coffee-700 transition-colors duration-200 py-2"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link href="/contact" className="btn-primary text-sm">
              Request Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-base font-medium text-gray-700 hover:text-coffee-700 hover:bg-coffee-50 px-3 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

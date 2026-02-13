import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const footerNavigation = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ],
  // partners: [
  //   { name: 'For Buyers', href: '/for-buyers' },
  //   { name: 'For Suppliers', href: '/for-suppliers' },
  // ],
  products: [
    { name: 'Coffee', href: '/products#coffee' },
    { name: 'Spices', href: '/products#spices' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = '919535044721';
  const whatsappMessage = encodeURIComponent('Hello! I am interested in sourcing coffee/spices from Coorg. Please share more details.');

  return (
    <footer className="bg-coffee-950 text-white">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo-icon.png"
                alt="Bean Sourced"
                width={56}
                height={56}
                className="h-14 w-auto brightness-0 invert"
              />
              <span className="font-serif text-2xl font-bold text-white">
                Bean Sourced
              </span>
            </Link>
            <p className="text-coffee-300 text-sm leading-relaxed mb-6">
              Your trusted Coffee & Spice Sourcing Partner from Coorg, connecting verified farmers and traders with serious bulk buyers across India and international markets.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-coffee-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-3">
              {footerNavigation.products.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-coffee-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coffee-400 flex-shrink-0 mt-0.5" />
                <span className="text-coffee-300 text-sm">
                  Kodagu (Coorg), Karnataka,<br />India - 571201
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-coffee-400 flex-shrink-0" />
                <a
                  href="tel:+919535044721"
                  className="text-coffee-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  +91 95350 44721
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-coffee-400 flex-shrink-0" />
                <a
                  href="mailto:info@beansourced.com"
                  className="text-coffee-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  info@beansourced.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-coffee-800">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-coffee-400 text-sm">
              &copy; {currentYear} Bean Sourced. All rights reserved.
            </p>
            <p className="text-coffee-500 text-xs max-w-2xl text-center md:text-right">
              Disclaimer: We act solely as a sourcing and trade facilitation partner. We do not take ownership of goods. All commercial transactions are directly between buyer and seller.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

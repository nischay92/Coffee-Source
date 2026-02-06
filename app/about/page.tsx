import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Users, TrendingUp, MapPin, Award, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - CoorgSource | Coffee & Spice Sourcing Partner',
  description: 'Learn about CoorgSource - your trusted coffee and spice sourcing partner based in Kodagu (Coorg), Karnataka. We connect farmers with bulk buyers through transparent trade facilitation.',
  keywords: 'about CoorgSource, coffee sourcing company, spice trading partner, Coorg coffee, Karnataka coffee supplier, trade facilitation India',
};

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    points: [
      'To connect quality producers with serious buyers',
      'To improve transparency in bulk agricultural trade',
      'To support farmers with better market access',
      'To help buyers source consistent quality at origin prices',
    ],
  },
];

const differentiators = [
  {
    title: 'Origin Expertise',
    description: 'Deep knowledge of Coorg\'s coffee and spice ecosystem built over years of working with local producers.',
  },
  {
    title: 'Quality Focus',
    description: 'Rigorous quality verification process ensuring every shipment meets buyer specifications.',
  },
  {
    title: 'Transparent Dealings',
    description: 'Clear commission-based model with no hidden costs or surprise charges.',
  },
  {
    title: 'Long-term Partnerships',
    description: 'We focus on building lasting relationships, not one-time transactions.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-coffee-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900 to-transparent" />
        </div>
        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-coffee-200 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Based in Kodagu, Karnataka
            </div>
            <h1 className="heading-primary text-white mb-6">About CoorgSource</h1>
            <p className="text-xl text-coffee-100 leading-relaxed">
              Your professional sourcing bridge between producers and bulk buyers, 
              operating from India's most premium coffee and spice producing region.
            </p>
          </div>
        </div>
      </section>

      {/* Main About Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-secondary mb-6">Who We Are</h2>
              <p className="text-body mb-6">
                Based in <strong className="text-coffee-700">Kodagu (Coorg), Karnataka</strong> — one of India's 
                most premium coffee and spice producing regions — we act as a professional sourcing bridge 
                between producers and bulk buyers.
              </p>
              <p className="text-body mb-6">
                Our mission is to simplify bulk agricultural trade by offering reliable sourcing, fair pricing, 
                and long-term partnership building for both buyers and suppliers.
              </p>
              <div className="bg-coffee-50 border-l-4 border-coffee-700 p-6 rounded-r-lg">
                <p className="text-gray-700 italic">
                  "We do not directly sell products. Instead, we facilitate verified connections, negotiations, 
                  sampling, quality coordination, and trade execution on a commission basis."
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/coffee-plantation.png"
                  alt="Coffee plantation in Coorg"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-6 h-6" />
                    <span className="font-semibold">Trusted Partner</span>
                  </div>
                  <p className="text-sm text-white/80">Facilitating agricultural trade since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 rounded-full mb-6">
                <Target className="w-8 h-8 text-coffee-700" />
              </div>
              <h2 className="heading-secondary mb-4">Our Mission</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Connect Quality Producers</h3>
                    <p className="text-gray-600">Bridge the gap between quality producers and serious buyers seeking consistent supply.</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Improve Transparency</h3>
                    <p className="text-gray-600">Bring transparency to bulk agricultural trade with clear pricing and processes.</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Support Farmers</h3>
                    <p className="text-gray-600">Help farmers access better markets and achieve fair prices for their produce.</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Origin Pricing for Buyers</h3>
                    <p className="text-gray-600">Enable buyers to source consistent quality at competitive origin prices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">What Makes Us Different</h2>
            <p className="text-body max-w-2xl mx-auto">
              Our approach to trade facilitation sets us apart in the industry
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Coorg Advantage */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-4">The Coorg Advantage</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-secondary-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Location</h3>
                <p className="text-gray-600 text-sm">
                  Kodagu is renowned for producing some of India's finest coffee and spices due to its unique microclimate.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-secondary-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Local Relationships</h3>
                <p className="text-gray-600 text-sm">
                  Strong connections with farmers and local traders built over years of working in the region.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Market Intelligence</h3>
                <p className="text-gray-600 text-sm">
                  Real-time understanding of local market conditions, pricing trends, and availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-coffee-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Let's Build a Partnership
            </h2>
            <p className="text-xl text-coffee-200 mb-8">
              Whether you're looking to source quality products or expand your market reach, 
              we're here to facilitate successful trade relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-coffee-900 hover:bg-coffee-100">
                Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/how-it-works" className="btn-secondary border-white text-white hover:bg-white/10">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Users,
  Shield,
  Globe,
  Handshake,
  ArrowRight,
  Coffee,
  Leaf,
  Award,
  MapPin,
} from 'lucide-react';

const coffeeJourney = [
  {
    image: '/images/coffee-plantation.png',
    title: 'Plantation',
    description: 'Coffee grows in the misty hills of Coorg',
  },
  {
    image: '/images/coffee-harvesting.png',
    title: 'Harvesting',
    description: 'Hand-picked ripe cherries ensure quality',
  },
  {
    image: '/images/coffee-drying.png',
    title: 'Processing',
    description: 'Traditional sun-drying on raised beds',
  },
  {
    image: '/images/green-coffee-beans.png',
    title: 'Export Ready',
    description: 'Green beans ready for global markets',
  },
];

const trustFactors = [
  {
    icon: MapPin,
    title: 'Direct Origin Sourcing',
    description: 'Direct sourcing from Coorg & South India producing regions',
  },
  {
    icon: Users,
    title: 'Strong Network',
    description: 'Established farmer & trader network across key growing areas',
  },
  {
    icon: Shield,
    title: 'Quality Verification',
    description: 'Quality verification & grading support for every shipment',
  },
  {
    icon: Handshake,
    title: 'Buyer-Supplier Matching',
    description: 'Expert matching of buyers with verified suppliers',
  },
  {
    icon: Globe,
    title: 'End-to-End Coordination',
    description: 'Complete trade coordination from sourcing to delivery',
  },
];

const products = [
  {
    category: 'Coffee',
    icon: Coffee,
    items: ['Arabica Coffee Beans', 'Robusta Coffee Beans', 'Roasted Coffee Beans'],
    color: 'bg-coffee-100',
    iconColor: 'text-coffee-700',
  },
  {
    category: 'Spices',
    icon: Leaf,
    items: ['Black Pepper (Various Grades)', 'Cardamom'],
    color: 'bg-secondary-100',
    iconColor: 'text-secondary-700',
  },
];

const stats = [
  { value: '500+', label: 'Verified Farmers' },
  { value: '50+', label: 'Trader Partners' },
  { value: '100+', label: 'Successful Trades' },
  { value: '15+', label: 'Export Markets' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom section-padding relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-coffee-700 text-sm font-medium mb-6 animate-fade-in">
              <Award className="w-4 h-4" />
              Trusted Sourcing Partner Since 2025
            </div>
            
            <h1 className="heading-primary mb-6 animate-fade-in">
              Premium Coffee & Spice Sourcing{' '}
              <span className="text-coffee-700">from Coorg</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 animate-fade-in-delay-1 font-light">
              Connecting Farmers, Traders & Bulk Buyers
              <br className="hidden sm:block" />
              Across India & Global Markets
            </p>
            
            <p className="text-lg text-coffee-600 font-medium mb-10 animate-fade-in-delay-2">
              Trusted Trade Facilitation & Commission-Based Sourcing Partner
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Link href="/contact" className="btn-primary text-lg px-8 py-4">
                Request a Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/for-buyers" className="btn-secondary text-lg px-8 py-4">
                Become a Buyer Partner
              </Link>
              <Link href="/products" className="btn-secondary text-lg px-8 py-4">
                Source from Coorg
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Summary Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-secondary mb-6">
              Your Trusted Sourcing Bridge from Coorg
            </h2>
            <p className="text-body mb-8">
              We are a Coorg-based sourcing and trade facilitation partner specializing in coffee and spices. 
              We work closely with farmers, aggregators, and local traders to connect them with verified bulk 
              buyers, exporters, wholesalers, and institutional clients across India and international markets.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">What We Source</h2>
            <p className="text-body max-w-2xl mx-auto">
              Premium quality coffee and spices sourced directly from Coorg and South Indian plantations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product, index) => (
              <div key={index} className={`card p-8 ${product.color}`}>
                <div className="flex items-center gap-3 mb-6">
                  <product.icon className={`w-8 h-8 ${product.iconColor}`} />
                  <h3 className="font-serif text-2xl font-semibold text-gray-900">{product.category}</h3>
                </div>
                <ul className="space-y-3">
                  {product.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${product.iconColor}`} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/products" 
                  className={`inline-flex items-center gap-2 mt-6 font-medium ${product.iconColor} hover:underline`}
                >
                  View All Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Journey Section */}
      {/*
      <section className="section-padding bg-coffee-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">From Farm to Export</h2>
            <p className="text-body max-w-2xl mx-auto">
              Experience the journey of premium Coorg coffee from plantation to your destination
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coffeeJourney.map((step, index) => (
              <div key={index} className="group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-8 h-8 bg-coffee-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Spices Showcase */}
      {/* Explore Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="/images/spices-display.png"
              >
                <source src="/videos/coffee-spices.mp4" type="video/mp4" />
                {/* Fallback to image if video doesn't load */}
                <Image
                  src="/images/spices-display.png"
                  alt="Coffee and Spices from Coorg"
                  fill
                  className="object-cover"
                />
              </video>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div>
              <h2 className="heading-secondary mb-6">Explore Our Products</h2>
              <p className="text-body mb-6">
                From the misty hills of Coorg, we source India's finest coffee and aromatic spices. 
                Our network connects you directly with premium Arabica, Robusta, black pepper, 
                cardamom, and more.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-coffee-50 rounded-lg">
                  <Coffee className="w-6 h-6 text-coffee-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Coffee</p>
                    <p className="text-sm text-gray-600">Arabica, Robusta & more</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                  <Leaf className="w-6 h-6 text-secondary-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Spices</p>
                    <p className="text-sm text-gray-600">Pepper & Cardamom</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Premium Arabica, Robusta & Roasted Beans', 'Black Pepper - Known as Black Gold', 'Cardamom - Queen of Spices'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/products" className="btn-primary">
                View All Products <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/*<section className="py-12 bg-coffee-700">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-coffee-200 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Trust Factors Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Why Choose Us</h2>
            <p className="text-body max-w-2xl mx-auto">
              We bring together the best of origin sourcing with professional trade facilitation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustFactors.map((factor, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                    <factor.icon className="w-6 h-6 text-coffee-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{factor.title}</h3>
                    <p className="text-gray-600">{factor.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Overview */}
      

      {/* How It Works Preview */}
      <section className="section-padding bg-coffee-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Simple, Transparent Process</h2>
            <p className="text-body max-w-2xl mx-auto">
              From requirement to delivery, we handle every step of the sourcing journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="font-semibold text-lg mb-2">Share Requirements</h3>
              <p className="text-gray-600">Tell us your product, quantity, and quality needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="font-semibold text-lg mb-2">We Source & Match</h3>
              <p className="text-gray-600">We find the best suppliers and arrange samples</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="font-semibold text-lg mb-2">Execute Trade</h3>
              <p className="text-gray-600">We coordinate the complete trade execution</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn-primary">
              Learn How It Works <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-coffee-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Ready to Source Premium Coffee & Spices?
            </h2>
            <p className="text-xl text-coffee-200 mb-8">
              Whether you're a buyer looking for quality products or a supplier seeking better market access, 
              we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-coffee-900 hover:bg-coffee-100">
                Request a Quote
              </Link>
              <Link href="/for-suppliers" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-200">
                Partner with Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  MapPin, 
  TrendingDown, 
  ShieldCheck, 
  Users, 
  AlertTriangle,
  Building2,
  ArrowRight,
  CheckCircle,
  Package,
  FileText,
  CreditCard
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Buyers - Bulk Coffee & Spice Sourcing | Bean Sourced',
  description: 'Source quality coffee and spices directly from Coorg. We work with wholesalers, exporters, roasters, and institutional buyers. Competitive pricing, verified suppliers.',
  keywords: 'bulk coffee buyer India, wholesale spice purchase, coffee exporter supplier, bulk pepper buyer, institutional coffee supplier, roaster coffee supply',
};

const buyerTypes = [
  { icon: Building2, label: 'Wholesalers' },
  { icon: Building2, label: 'Exporters' },
  { icon: Building2, label: 'Roasters' },
  { icon: Building2, label: 'Spice Traders' },
  { icon: Building2, label: 'Processors' },
  { icon: Building2, label: 'Institutional Buyers' },
];

const benefits = [
  {
    icon: MapPin,
    title: 'Direct Origin Sourcing',
    description: 'Access products directly from Coorg and South Indian producing regions without intermediary markups.',
  },
  {
    icon: TrendingDown,
    title: 'Competitive Pricing',
    description: 'Our local presence and direct farmer relationships enable better price discovery and competitive rates.',
  },
  {
    icon: ShieldCheck,
    title: 'Consistent Quality',
    description: 'Quality verification at source ensures every shipment meets your specifications.',
  },
  {
    icon: Users,
    title: 'Reliable Supplier Network',
    description: 'Access our network of verified farmers, aggregators, and traders with proven track records.',
  },
  {
    icon: AlertTriangle,
    title: 'Reduced Sourcing Risk',
    description: 'We handle supplier verification, quality checks, and coordination to minimize your risk.',
  },
  {
    icon: MapPin,
    title: 'Local Presence at Origin',
    description: 'Our team on ground ensures real-time market intelligence and quality supervision.',
  },
];

const buyerInfo = [
  {
    icon: Package,
    title: 'Minimum Order Quantity (MOQ)',
    content: 'Varies by product. Generally 1 MT minimum for most products. Smaller quantities may be arranged for premium grades.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Grading',
    content: 'All products graded as per industry standards. Custom grading available per buyer specification. Pre-shipment samples provided.',
  },
  {
    icon: Package,
    title: 'Packaging Options',
    content: 'Standard jute bags, HDPE bags, or custom packaging as per buyer requirement. Export-quality packaging available.',
  },
  {
    icon: MapPin,
    title: 'Domestic & Export Coordination',
    content: 'Pan-India delivery coordination. Export documentation support through our partner network.',
  },
  {
    icon: CreditCard,
    title: 'Payment Terms',
    content: 'Payment terms are agreed directly between buyer and seller. We facilitate negotiation but do not handle payments.',
  },
];

export default function ForBuyersPage() {
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
              <Building2 className="w-4 h-4" />
              For Bulk Buyers & Traders
            </div>
            <h1 className="heading-primary text-white mb-6">Source Quality Products from Coorg</h1>
            <p className="text-xl text-coffee-100 leading-relaxed">
              Whether you're a wholesaler, exporter, roaster, or institutional buyer, 
              we help you source consistent quality at competitive origin prices.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-12 bg-coffee-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-gray-700">We Work With</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {buyerTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <type.icon className="w-4 h-4 text-coffee-600" />
                <span className="text-gray-700 font-medium">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Buyer Benefits</h2>
            <p className="text-body max-w-2xl mx-auto">
              Partner with us to access premium products and streamlined sourcing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-coffee-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Information */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Buyer Information</h2>
            <p className="text-body max-w-2xl mx-auto">
              Key details you need to know before sourcing with us
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {buyerInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <info.icon className="w-6 h-6 text-secondary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{info.title}</h3>
                    <p className="text-gray-600">{info.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Need From You */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <FileText className="w-12 h-12 text-coffee-700 mx-auto mb-4" />
              <h2 className="heading-secondary mb-4">What We Need From You</h2>
              <p className="text-body">
                To help you efficiently, please provide the following details in your enquiry
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Product type and variety',
                'Quantity required (MT/KG)',
                'Quality grade specifications',
                'Packaging preference',
                'Delivery destination',
                'Target price (if any)',
                'Timeline/urgency',
                'Company profile (if available)',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-coffee-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-coffee-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-coffee-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Start Sourcing Today
            </h2>
            <p className="text-xl text-coffee-200 mb-8">
              Share your requirements and let us find the perfect supply solution for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-coffee-900 hover:bg-coffee-100">
                Submit Requirement <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-200">
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingUp, 
  Building2, 
  Users, 
  Handshake,
  BarChart3,
  Sprout,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Suppliers & Farmers - Partner with CoorgSource',
  description: 'Partner with CoorgSource to access bulk buyers across India and international markets. Fair pricing, reliable payments, and long-term partnerships for farmers, FPOs, and traders.',
  keywords: 'sell coffee bulk, coffee supplier registration, spice trader partnership, farmer market access, FPO coffee sale, agricultural trade partner',
};

const supplierTypes = [
  { icon: Sprout, label: 'Farmers' },
  { icon: Users, label: 'FPOs' },
  { icon: Building2, label: 'Aggregators' },
  { icon: Building2, label: 'Local Traders' },
  { icon: Building2, label: 'Estate Owners' },
  { icon: Building2, label: 'Processors' },
];

const benefits = [
  {
    icon: TrendingUp,
    title: 'Better Price Discovery',
    description: 'Access real market prices and connect directly with bulk buyers willing to pay fair rates.',
  },
  {
    icon: Building2,
    title: 'Access to Institutional Buyers',
    description: 'Connect with wholesalers, exporters, roasters, and large traders across India and international markets.',
  },
  {
    icon: Users,
    title: 'Reduced Dependency',
    description: 'Reduce reliance on local middlemen with direct access to serious bulk buyers.',
  },
  {
    icon: Handshake,
    title: 'Long-term Buyer Relationships',
    description: 'Build lasting partnerships with repeat buyers for consistent business.',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description: 'Stay informed about market trends, pricing movements, and demand patterns.',
  },
  {
    icon: CheckCircle,
    title: 'Professional Support',
    description: 'Get help with documentation, grading standards, and meeting buyer requirements.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Register with Us',
    description: 'Share your profile, products, and capacity. We verify and onboard you to our network.',
  },
  {
    step: 2,
    title: 'Receive Buyer Enquiries',
    description: 'When buyers match your product profile, we connect you with verified opportunities.',
  },
  {
    step: 3,
    title: 'Negotiate & Trade',
    description: 'We facilitate negotiation, sampling, and trade execution. You deal directly with the buyer.',
  },
  {
    step: 4,
    title: 'Get Paid & Grow',
    description: 'Receive payment directly from buyers. Build your reputation and access more opportunities.',
  },
];

export default function ForSuppliersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-secondary-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900 to-transparent" />
        </div>
        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-secondary-200 text-sm font-medium mb-6">
              <Sprout className="w-4 h-4" />
              For Farmers, FPOs & Traders
            </div>
            <h1 className="heading-primary text-white mb-6">Expand Your Market Reach</h1>
            <p className="text-xl text-secondary-100 leading-relaxed">
              Connect with verified bulk buyers across India and international markets. 
              Get fair prices, reliable business, and long-term partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Support */}
      <section className="py-12 bg-secondary-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-gray-700">We Help</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {supplierTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <type.icon className="w-4 h-4 text-secondary-600" />
                <span className="text-gray-700 font-medium">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supplier Benefits */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Supplier Benefits</h2>
            <p className="text-body max-w-2xl mx-auto">
              Partner with us to grow your business and access better opportunities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-secondary-700" />
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

      {/* How It Works for Suppliers */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">How It Works</h2>
            <p className="text-body max-w-2xl mx-auto">
              Simple process to start selling to bulk buyers
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {howItWorks.map((item) => (
                <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary-700 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-4">What We Look For in Partners</h2>
              <p className="text-body">
                We work with suppliers who share our commitment to quality and reliability
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Consistent quality production',
                'Reliable supply capacity',
                'Fair dealing practices',
                'Proper storage facilities',
                'Willingness to provide samples',
                'Commitment to agreed timelines',
                'Accurate documentation',
                'Interest in long-term partnerships',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-secondary-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commission Note */}
      <section className="py-12 bg-secondary-700 text-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Transparent Commission Model</h3>
            <p className="text-secondary-100">
              Our commission is a small percentage of the trade value, discussed and agreed upon before any trade. 
              We only earn when you successfully complete a sale. No upfront fees, no hidden charges.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-coffee-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Ready to Expand Your Market?
            </h2>
            <p className="text-xl text-coffee-200 mb-8">
              Register as a supplier partner and start accessing bulk buyer opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-coffee-900 hover:bg-coffee-100">
                Register as Supplier <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/how-it-works" className="btn-secondary border-white text-white hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

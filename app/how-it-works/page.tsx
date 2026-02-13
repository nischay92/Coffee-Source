import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ClipboardList, 
  Search, 
  PackageCheck, 
  DollarSign, 
  Truck,
  ArrowRight,
  ArrowDown,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works - Our Sourcing Process | BeanSource',
  description: 'Learn about our simple 5-step sourcing process. From requirement submission to trade execution, we handle every step of coffee and spice sourcing.',
  keywords: 'coffee sourcing process, spice trade facilitation, bulk commodity sourcing, agricultural trade process, coffee export process India',
};

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'Buyer Requirement',
    description: 'Buyer submits product requirement including quantity, grade, packing, destination, and target price.',
    details: [
      'Product type and variety',
      'Quantity required (MT/bags)',
      'Quality specifications',
      'Packaging preferences',
      'Delivery destination',
      'Target price range',
    ],
  },
  {
    number: 2,
    icon: Search,
    title: 'Supplier Sourcing',
    description: 'We source matching suppliers from our farmer and trader network in Coorg and other major producing regions.',
    details: [
      'Network of 500+ verified farmers',
      'Partnerships with aggregators',
      'Access to local traders',
      'Coverage across Karnataka',
      'Real-time availability check',
    ],
  },
  {
    number: 3,
    icon: PackageCheck,
    title: 'Quality Check',
    description: 'Quality parameters are verified against specifications.',
    details: [
      
      'Quality parameter testing',
      'Grade verification',
      'Moisture & defect analysis',
      'Photo/video documentation',
    ],
  },
  {
    number: 4,
    icon: DollarSign,
    title: 'Price & Terms Negotiation',
    description: 'We assist in price discovery, negotiation, and commercial term alignment between buyer and seller.',
    details: [
      'Market price intelligence',
      'Fair price discovery',
      'Payment terms discussion',
      'Contract term alignment',
      'Documentation support',
    ],
  },
  {
    number: 5,
    icon: Truck,
    title: 'Logistics Coordination',
    description: 'We support coordination for dispatch, transport, warehousing, and export documentation (if required through partners).',
    details: [
      'Transport arrangement',
      'Warehouse coordination',
      'Loading supervision',
      'Export documentation support',
      'Shipment tracking',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-coffee-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900 to-transparent" />
        </div>
        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="heading-primary text-white mb-6">How It Works</h1>
            <p className="text-xl text-coffee-100 leading-relaxed">
              Our simple, transparent 5-step process makes sourcing coffee and spices 
              from Coorg straightforward and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number}>
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  {/* Step Number & Icon */}
                  <div className="md:col-span-2 flex md:flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-coffee-700 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {step.number}
                    </div>
                    <step.icon className="w-8 h-8 text-coffee-400 hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="md:col-span-10">
                    <div className="bg-gray-50 rounded-2xl p-8">
                      <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-4">
                        Step {step.number}: {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-secondary-600 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-6 md:ml-8">
                    <ArrowDown className="w-8 h-8 text-coffee-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-4">Why This Process Works</h2>
              <p className="text-body">
                Our streamlined process is designed to protect both buyers and suppliers
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-secondary-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2">For Buyers</h3>
                <p className="text-gray-600 text-sm">
                  Verified suppliers, quality assurance, competitive pricing, and hassle-free logistics
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-secondary-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2">For Suppliers</h3>
                <p className="text-gray-600 text-sm">
                  Access to serious buyers, fair pricing, secure transactions, and market expansion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      {/* <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-secondary text-center mb-10">Common Questions</h2>
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">What is your commission structure?</h3>
                <p className="text-gray-600">
                  Our commission is transparent and discussed upfront. It's typically a percentage of the trade value, 
                  agreed upon before trade execution. We only earn when the trade is successfully completed.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">Do you take ownership of the goods?</h3>
                <p className="text-gray-600">
                  No. We act solely as a trade facilitation partner. All commercial transactions are directly between 
                  the buyer and seller. We facilitate the connection, negotiation, and coordination.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-2">What is the minimum order quantity?</h3>
                <p className="text-gray-600">
                  MOQ varies by product and supplier. Generally, we work with bulk orders starting from 
                  1 MT for most products. Share your requirements and we'll find suitable options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="section-padding bg-coffee-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Ready to Start Sourcing?
            </h2>
            <p className="text-xl text-coffee-200 mb-8">
              Submit your requirement today and let us find the perfect supply solution for you.
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

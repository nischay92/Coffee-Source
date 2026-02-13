import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Leaf, ArrowRight, CheckCircle, Info, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Products - Coffee & Spices | Bean Sourced',
  description: 'Source premium Arabica, Robusta coffee beans, black pepper, cardamom, and other spices from Coorg. All products sourced through verified farmers and traders.',
  keywords: 'Arabica coffee beans India, Robusta coffee supplier, black pepper bulk, green cardamom wholesale, Coorg coffee, plantation AA coffee, parchment coffee, cherry coffee',
};

const coffeeProducts = [
  {
    name: 'Arabica Coffee Beans',
    description: 'Premium Arabica beans known for their smooth, mild flavor with fruity and floral notes. Grown at higher elevations in Coorg.',
    grades: ['Grade A', 'Grade AA', 'Grade AAA'],
  },
  {
    name: 'Robusta Coffee Beans',
    description: 'Strong, bold Robusta beans with higher caffeine content. Ideal for espresso blends and instant coffee production.',
    grades: ['Grade A', 'Grade AA', 'Grade AAA'],
  },
  {
    name: 'Roasted Coffee Beans',
    description: 'Expertly roasted coffee beans with rich aroma and full-bodied flavor. Available in light, medium, and dark roast profiles.',
    grades: ['Grade A', 'Grade AA', 'Grade AAA'],
  },
];

const spiceProducts = [
  {
    name: 'Black Pepper',
    description: 'Known as "Black Gold," Coorg black pepper is renowned for its pungent aroma and bold flavor. Available in multiple grades.',
    grades: ['MG1', 'TGEB', 'FAQ', 'Pinhead'],
  },
  {
    name: 'Cardamom',
    description: 'Aromatic green cardamom with intense flavor. Essential for culinary, medicinal, and aromatic applications.',
    grades: ['8mm Bold', '7mm', '6mm'],
  },
  // {
  //   name: 'Black Cardamom',
  //   description: 'Smoky, robust black cardamom primarily used in savory dishes and traditional medicine.',
  //   grades: ['Premium', 'Standard'],
  // },
  // {
  //   name: 'Cloves',
  //   description: 'High-quality cloves with intense aroma and flavor. Sourced from South Indian plantations.',
  //   grades: ['Hand-picked', 'Machine Cleaned'],
  // },
  // {
  //   name: 'Areca Nut',
  //   description: 'Also known as betel nut, sourced from Coorg and surrounding regions. Available whole or processed.',
  //   grades: ['Whole', 'Split', 'Processed'],
  // },
  // {
  //   name: 'Other Plantation Spices',
  //   description: 'Additional spices available on request including nutmeg, mace, and other regional specialties.',
  //   grades: ['As per requirement'],
  // },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-coffee-800 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/coffee-roasting.png"
            alt="Coffee roasting"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900 via-coffee-900/80 to-coffee-900/60" />
        </div>
        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="heading-primary text-white mb-6">Our Products</h1>
            <p className="text-xl text-coffee-100 leading-relaxed">
              Premium coffee and spices sourced directly from Coorg and South Indian plantations. 
              All products verified for quality and sourced through our trusted network.
            </p>
          </div>
        </div>
      </section>

      {/* Product Note */}
      <section className="bg-coffee-50 py-6">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <Info className="w-6 h-6 text-coffee-700 flex-shrink-0 mt-0.5" />
            <p className="text-coffee-800">
              <strong>Note:</strong> All products are sourced through verified farmers, aggregators, and traders. 
              Specifications, grades, moisture, density, and quality parameters are confirmed as per buyer requirement.
            </p>
          </div>
        </div>
      </section>

      {/* Coffee Section */}
      <section id="coffee" className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-coffee-100 rounded-xl flex items-center justify-center">
              <Coffee className="w-8 h-8 text-coffee-700" />
            </div>
            <div>
              <h2 className="heading-secondary">Coffee</h2>
              <p className="text-gray-600">Premium varieties from Coorg plantations</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coffeeProducts.map((product, index) => (
              <div key={index} className="card p-6 border border-coffee-100">
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Available Grades</p>
                  <div className="flex flex-wrap gap-2">
                    {product.grades.map((grade, gradeIndex) => (
                      <span 
                        key={gradeIndex} 
                        className="inline-flex items-center px-2.5 py-1 bg-coffee-50 text-coffee-700 text-xs rounded-full"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spices Section */}
      <section id="spices" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-secondary-700" />
            </div>
            <div>
              <h2 className="heading-secondary">Spices</h2>
              <p className="text-gray-600">Aromatic spices from South Indian estates</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spiceProducts.map((product, index) => (
              <div key={index} className="card p-6 border border-secondary-100">
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Available Grades</p>
                  <div className="flex flex-wrap gap-2">
                    {product.grades.map((grade, gradeIndex) => (
                      <span 
                        key={gradeIndex} 
                        className="inline-flex items-center px-2.5 py-1 bg-secondary-50 text-secondary-700 text-xs rounded-full"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Parameters */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Package className="w-12 h-12 text-coffee-700 mx-auto mb-4" />
              <h2 className="heading-secondary mb-4">Quality Parameters We Verify</h2>
              <p className="text-body">
                Every shipment is checked against buyer specifications
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'Moisture Content',
                'Bean Size & Screen',
                'Defect Count',
                'Density/Bulk Weight',
                'Color & Appearance',
                'Cup Quality (Coffee)',
                'Aroma Profile (Spices)',
                'Foreign Matter',
                'Packaging Standards',
              ].map((param, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-secondary-600" />
                  <span className="text-gray-700">{param}</span>
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
              Looking for Specific Products?
            </h2>
            <p className="text-xl text-coffee-200 mb-8">
              Share your requirements and we'll source the exact grade and quantity you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-coffee-900 hover:bg-coffee-100">
                Request Quote <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-200">
                How Sourcing Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

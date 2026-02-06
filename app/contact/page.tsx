'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Send,
  Building2,
  Clock,
  CheckCircle
} from 'lucide-react';

const products = [
  'Arabica Coffee',
  'Robusta Coffee',
  'Black Pepper',
  'Green Cardamom',
  'Black Cardamom',
  'Cloves',
  'Areca Nut',
  'Other',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    type: '',
    product: '',
    quantity: '',
    destination: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const whatsappNumber = '919535044721'; // Replace with actual number
  const whatsappMessage = encodeURIComponent('Hello! I am interested in sourcing coffee/spices from Coorg. Please share more details.');

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-coffee-800 text-white py-20 lg:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900 to-transparent" />
        </div>
        <div className="container-custom px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="heading-primary text-white mb-6">Contact Us</h1>
            <p className="text-xl text-coffee-100 leading-relaxed">
              Ready to source premium coffee and spices from Coorg? 
              Get in touch with us to discuss your requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="heading-secondary mb-6">Get in Touch</h2>
              <p className="text-body mb-8">
                Whether you're a buyer looking for quality products or a supplier seeking market access, 
                we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-coffee-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                    <p className="text-gray-600">
                      Kodagu (Coorg), Karnataka<br />
                      India - 571201
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-coffee-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+919535044721" className="text-coffee-700 hover:underline">
                    +91 95350 44721
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-coffee-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:info@coorgsource.com" className="text-coffee-700 hover:underline">
                      info@coorgsource.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-coffee-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Mon - Sat: 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="mt-8">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="heading-secondary mb-2">Enquiry Form</h2>
                <p className="text-gray-600 mb-8">Fill in your details and we'll get back to you within 24 hours.</p>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-secondary-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your enquiry has been submitted successfully. Our team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          companyName: '',
                          type: '',
                          product: '',
                          quantity: '',
                          destination: '',
                          email: '',
                          phone: '',
                          message: '',
                        });
                      }}
                      className="btn-secondary"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                          placeholder="Your Company Ltd."
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                          I am a *
                        </label>
                        <select
                          id="type"
                          name="type"
                          required
                          value={formData.type}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors bg-white"
                        >
                          <option value="">Select Type</option>
                          <option value="buyer">Buyer</option>
                          <option value="supplier">Supplier / Farmer</option>
                          <option value="trader">Trader</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                          Product Interest *
                        </label>
                        <select
                          id="product"
                          name="product"
                          required
                          value={formData.product}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors bg-white"
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product} value={product.toLowerCase().replace(' ', '-')}>
                              {product}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity (approx)
                        </label>
                        <input
                          type="text"
                          id="quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                          placeholder="e.g., 5 MT, 1000 KG"
                        />
                      </div>
                      <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                          Destination
                        </label>
                        <input
                          type="text"
                          id="destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                          placeholder="+91 95350 XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us more about your requirements, quality specifications, or any other details..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Enquiry
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-600">
              <strong>Disclaimer:</strong> We act solely as a sourcing and trade facilitation partner. 
              We do not take ownership of goods. All commercial transactions are directly between buyer and seller. 
              Our role is limited to sourcing, coordination, and facilitation on a commission basis.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

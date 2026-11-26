export const collections = [
  { slug: 'green-coffee', name: 'Green Coffee', image: '/images/green-coffee-beans.png', alt: 'Unroasted green coffee beans' },
  { slug: 'roasted-coffee', name: 'Roasted Coffee', image: '/images/coffee-roasting.png', alt: 'Roasted coffee beans in a ceramic bowl' },
  { slug: 'signature-blends', name: 'Signature Blends', image: '/images/coffee-drying.png', alt: 'Coffee beans spread out for drying' },
  { slug: 'coffee-gifting', name: 'Coffee Gifting', image: '/images/coffee-harvesting.png', alt: 'Coffee cherries at harvest' },
] as const;

export const services = [
  {
    slug: 'bulk-sourcing', title: 'Bulk Sourcing', label: 'FOR ROASTERS & TRADE BUYERS',
    short: 'Green and roasted coffee for roasters, distributors and trade buyers.',
    description: 'Tell us what you need to source from Coorg. We’ll discuss Arabica or Robusta, green or roasted formats, confirmed grades, processing, packaging and delivery requirements.',
    image: '/images/green-coffee-beans.png', alt: 'Green coffee beans',
    details: ['Green or roasted Arabica and Robusta', 'Grade, processing and packaging by requirement', 'Domestic, export and trade enquiries'],
  },
  {
    slug: 'corporate-supply', title: 'Corporate Supply', label: 'FOR OFFICES & HOSPITALITY',
    short: 'Coffee for cafés, offices and hospitality teams.',
    description: 'Plan a coffee supply that fits the way your team serves it. Share your preferred format, estimated volume and delivery cadence to start the conversation.',
    image: '/images/coffee-roasting.png', alt: 'A bowl of roasted coffee beans',
    details: ['Whole beans and ground coffee enquiries', 'Blend and recurring supply requirements', 'Office, café and hospitality programmes'],
  },
  {
    slug: 'private-labelling', title: 'Private Labelling', label: 'FOR COFFEE BRANDS',
    short: 'Coorg coffee packed for your own brand.',
    description: 'Develop a coffee offering under your own label. We’ll review your blend, roast, grind, pack sizes and branding brief with you.',
    image: '/images/coffee-drying.png', alt: 'Coffee beans drying',
    details: ['Arabica, Robusta and custom blend enquiries', 'Pack size, roast and format by availability', 'Brand-specific packaging and labels'],
  },
  {
    slug: 'gifting', title: 'Gifting', label: 'FOR TEAMS & OCCASIONS',
    short: 'Coffee gifts for teams, clients and occasions.',
    description: 'Tell us who you’re gifting to and the occasion. We’ll discuss coffee packs, gift boxes, custom combinations and branding that suit the brief.',
    image: '/images/coffee-harvesting.png', alt: 'Harvested coffee cherries',
    details: ['Corporate gifts and coffee boxes', 'Custom combinations and branding enquiries', 'Packaging, quantities and delivery by quote'],
  },
] as const;

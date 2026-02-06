# CoorgSource - Coffee & Spice Sourcing Website

A professional website for a Coffee & Spice Sourcing and Trade Facilitation business based in Coorg (Kodagu), Karnataka, India.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Features

- Mobile-responsive design
- SEO optimized with meta tags, sitemap, and robots.txt
- WhatsApp integration for quick inquiries
- Contact form with validation
- Modern, professional UI with custom color palette

## Pages

1. **Home** - Hero section, about summary, trust factors, product overview
2. **About Us** - Company story, mission, Coorg advantage
3. **Products** - Coffee and Spices with grades and descriptions
4. **How It Works** - 6-step sourcing process
5. **For Buyers** - Benefits and information for bulk buyers
6. **For Suppliers** - Benefits and information for farmers/traders
7. **Contact** - Enquiry form and contact details

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

This generates a static export in the `out` folder that can be deployed to any static hosting service.

## Configuration

### Contact Details
Update the following in the components:
- `components/Footer.tsx` - Phone, email, address
- `components/WhatsAppButton.tsx` - WhatsApp number
- `app/contact/page.tsx` - WhatsApp number

### SEO
- Update `app/layout.tsx` for global meta tags
- Update individual page metadata in each page file
- Update `app/sitemap.ts` with your domain
- Update `public/robots.txt` with your domain

### Deployment
The site is configured for static export. Deploy to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## License

Private - All rights reserved.

import { NextResponse } from 'next/server';
import { services } from '@/lib/content';
import { databaseConfigured, query } from '@/lib/db';
import { apiError, field, rateLimit, readJSON, RequestError, requestIdentity, requireOrigin } from '@/lib/http';

export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const data = await readJSON(request);
    if (data.website) throw new RequestError('This enquiry could not be accepted.');
    const service = field(data.service, 50, 'service', true);
    if (!['contact', 'custom-blend'].includes(service) && !services.some(item => item.slug === service)) throw new RequestError('Choose a valid service.');
    const blend = service === 'custom-blend' ? field(data.blend, 250, 'blend', true) : '';
    if (blend) {
      const ratios = /^Arabica: (\d{1,3})%, Robusta: (\d{1,3})%, Chicory: (\d{1,3})%/.exec(blend);
      if (!ratios || ratios.slice(1).reduce((sum, value) => sum + Number(value), 0) !== 100) throw new RequestError('Blend proportions must total 100%.');
    }
    const contact = {
      name: field(data.name, 100, 'name', true),
      companyName: field(data.companyName, 140, 'company name', !['contact', 'custom-blend'].includes(service)),
      email: field(data.email, 180, 'email', true),
      phone: field(data.phone, 30, 'phone'),
      type: field(data.type, 80, 'enquiry type'),
      product: field(data.product, 140, 'product'),
      grade: field(data.grade, 50, 'grade'),
      quantity: field(data.quantity, 80, 'quantity'),
      destination: field(data.destination, 140, 'destination'),
      message: field(data.message, 2500, 'message'),
      blend,
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) throw new RequestError('Enter a valid email address.');
    const hasDB = databaseConfigured();
    if (hasDB) {
      await rateLimit(`enquiry:${requestIdentity(request)}`, 12);
      await query('INSERT INTO enquiries (service, contact) VALUES ($1, $2)', [service, contact]);
    }
    const key = process.env.WEB3FORMS_ACCESS_KEY;
    if (!hasDB && !key) throw new RequestError('The form is unavailable. Please email or WhatsApp BeanSource.', 503);
    if (key) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...contact, access_key: key, from_name: 'BeanSource Website', subject: `BeanSource enquiry — ${service}` }),
          signal: AbortSignal.timeout(6_000),
        });
        if (!response.ok || !(await response.json()).success) throw new Error('Email delivery failed.');
      } catch {
        if (!hasDB) throw new RequestError('The enquiry could not be sent. Please email or WhatsApp BeanSource.', 502);
        console.warn('BeanSource enquiry saved; forwarding failed.');
      }
    }
    return NextResponse.json({ received: true }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

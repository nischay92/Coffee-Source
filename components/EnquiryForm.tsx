'use client';

import { useState, type FormEvent } from 'react';

export default function EnquiryForm({ service, preset, enabled = true }: { service: string; preset?: string; enabled?: boolean }) {
  const [status, setStatus] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch('/api/enquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), service, blend: preset }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      form.reset();
      setSent(true);
      setStatus('Your enquiry has been received.');
    } catch (error) {
      setSent(false);
      setStatus(error instanceof Error ? error.message : 'Please try again or contact us by email.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <label className="field">Contact name<input name="name" autoComplete="name" required maxLength={100} /></label>
      <label className="field">Company{service === 'custom-blend' ? ' (optional)' : ''}<input name="companyName" autoComplete="organization" required={service !== 'custom-blend'} maxLength={140} /></label>
      <label className="field">Email<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
      <label className="field">Phone <span className="font-normal">(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>
      <label className="field">Coffee or service needed<input name="product" maxLength={140} /></label>
      <label className="field">Estimated quantity<input name="quantity" maxLength={80} /></label>
      {service === 'bulk-sourcing' && <label className="field">Grade (if known)<input name="grade" maxLength={50} /></label>}
      <label className="field">Delivery destination<input name="destination" maxLength={140} /></label>
      <label className="field wide">Additional requirements<textarea name="message" maxLength={2500} /></label>
      <label className="sr-only" aria-hidden="true">Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {status && <p className={`wide status-note ${sent ? '' : 'status-error'}`} role="status">{status}</p>}
      <div className="wide"><button className="action" type="submit" disabled={busy || !enabled}>{busy ? 'Sending…' : 'Send enquiry'}</button></div>
    </form>
  );
}

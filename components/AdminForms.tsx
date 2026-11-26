'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminForm({
  action, label, children, className = 'panel form-grid',
}: { action: string; label: string; children?: ReactNode; className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [entryId, setEntryId] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const id = action === 'manual' ? entryId || crypto.randomUUID() : undefined;
    if (id) setEntryId(id);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), action, entryId: id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (action === 'login' || action === 'logout') {
        window.location.assign('/admin/');
        return;
      }
      setFailed(false);
      setMessage(result.message || 'Saved.');
      if (action === 'manual') {
        form.reset();
        setEntryId('');
      }
      router.refresh();
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <form className={className} onSubmit={submit}>
    {children}
    <div className="wide"><button type="submit" className={action === 'logout' ? 'text-link' : 'action'} disabled={busy}>{busy ? 'Working…' : label}</button></div>
    {message && <p className={`wide status-note ${failed ? 'status-error' : ''}`} role="status">{message}</p>}
  </form>;
}

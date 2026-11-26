'use client';

import { useState } from 'react';
import EnquiryForm from './EnquiryForm';

const ingredients = [
  { name: 'Arabica', color: '#6f4634' }, { name: 'Robusta', color: '#a77753' }, { name: 'Chicory', color: '#dbc0a4' },
];

export default function BlendBuilder() {
  const [parts, setParts] = useState([100, 0, 0]);
  const [format, setFormat] = useState('Whole beans');
  const [size, setSize] = useState('');
  const total = parts.reduce((sum, part) => sum + part, 0);
  const preset = [ingredients.map(({ name }, index) => `${name}: ${parts[index]}%`).join(', '), `Preferred format: ${format}`, size && `Requested pack size: ${size}`].filter(Boolean).join('. ');

  return <div className="service-form-grid">
    <div className="panel form-grid">
      <h2 className="font-serif text-2xl wide">Blend proportions</h2>
      <div className="wide flex h-5 bg-coffee-100 overflow-hidden" aria-hidden="true">
        {ingredients.map(({ name, color }, index) => <span key={name} style={{ width: `${parts[index] / Math.max(total, 100) * 100}%`, background: color }} />)}
      </div>
      {ingredients.map(({ name }, index) => <label className="field wide" key={name}>{name} (%)
        <input type="number" min={0} max={100} step={1} value={parts[index]}
          onChange={event => setParts(parts.map((part, pos) => pos === index ? Math.max(0, Math.min(100, Math.round(Number(event.target.value) || 0))) : part))} />
      </label>)}
      <p className="wide status-note" role="status">Total: {total}%{total !== 100 && ' · Adjust your proportions to make 100%.'}</p>
      <label className="field">Preferred format<select value={format} onChange={event => setFormat(event.target.value)}><option>Whole beans</option><option>Ground coffee</option></select></label>
      <label className="field">Requested pack size<input value={size} onChange={event => setSize(event.target.value)} maxLength={35} placeholder="e.g. 500 g" /></label>
    </div>
    <EnquiryForm service="custom-blend" preset={preset} enabled={total === 100} />
  </div>;
}

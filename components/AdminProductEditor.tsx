'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { AdminProduct } from '@/lib/admin-products';
import { collections } from '@/lib/content';
import { maxProductPhotos, maxProductPhotoBytes, maxProductUploadBytes } from '@/lib/product-media';

type Variant = {
  key: string; id?: string; sku: string; grade: string; roast: string; format: string; packSize: string;
  price: string; salePrice: string; stock: string; originalStock?: string; active: boolean;
};
type Photo = { key: string; path?: string; file?: File; alt: string };
const amount = (paise: number | null) => paise === null ? '' : (paise / 100).toFixed(2);

function StoredOrLocalPhoto({ photo }: { photo: Photo }) {
  const [src, setSrc] = useState(photo.path);
  useEffect(() => {
    if (!photo.file) return;
    const url = URL.createObjectURL(photo.file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.file]);
  return src ? <img src={src} alt="" /> : <div className="aspect-video bg-coffee-100" />;
}

export default function AdminProductEditor({ product, saved }: { product?: AdminProduct; saved?: boolean }) {
  const [variants, setVariants] = useState<Variant[]>(() => product?.variants.map(option => ({
    key: option.id, id: option.id, sku: option.sku, grade: option.grade ?? '', roast: option.roast ?? '',
    format: option.format ?? '', packSize: option.pack_size ?? '', price: amount(option.price_minor),
    salePrice: amount(option.sale_price_minor), stock: String(option.stock), originalStock: String(option.stock), active: option.active,
  })) ?? []);
  const [photos, setPhotos] = useState<Photo[]>(() => product?.images.map(photo => ({ ...photo, key: photo.path })) ?? []);
  const [photoError, setPhotoError] = useState('');
  const [visibility, setVisibility] = useState(product?.published ? 'published' : 'draft');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    if (!selected.length) return;
    if (photos.length + selected.length > maxProductPhotos) {
      setPhotoError(`You can include up to ${maxProductPhotos} photos per product.`);
      return;
    }
    const bytes = [...photos.flatMap(photo => photo.file ? [photo.file] : []), ...selected].reduce((sum, file) => sum + file.size, 0);
    if (selected.some(file => !file.size || file.size > maxProductPhotoBytes) || bytes > maxProductUploadBytes) {
      setPhotoError('Choose photos up to 2 MB each and 4 MB per save. Save a smaller batch and then add more.');
      return;
    }
    setPhotoError('');
    setPhotos([...photos, ...selected.map(file => ({ key: crypto.randomUUID(), file, alt: '' }))]);
  }

  function addVariant() {
    setVariants([...variants, {
      key: crypto.randomUUID(), sku: '', grade: '', roast: '', format: '', packSize: '',
      price: '', salePrice: '', stock: '', active: true,
    }]);
  }

  function updateVariant(key: string, update: Partial<Variant>) {
    setVariants(values => values.map(value => value.key === key ? { ...value, ...update } : value));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const data = new FormData();
    data.set('product', JSON.stringify({
      ...fields, id: product?.id, revision: product?.editor_revision, published: visibility === 'published',
      featured: fields.featured === 'on',
      variants: variants.map(({ key: _key, ...variant }) => variant),
      photos: photos.map(({ path, alt }) => ({ path, alt })),
    }));
    photos.forEach((photo, index) => {
      if (photo.file) data.set(`photo-${index}`, photo.file);
    });
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/products/', { method: 'POST', body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || (response.status === 413 ? 'These photos are too large. Try fewer photos per save.' : 'The product could not be saved. Please try again.'));
      window.location.assign(`/admin/products/${result.id}/?saved=1`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The product could not be saved.');
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="admin-product-form">
    {saved && !message && <p role="status" className="status-note">Product saved.</p>}
    <fieldset disabled={busy} className="panel form-grid" aria-labelledby="admin-product-details">
      <h2 id="admin-product-details" className="wide">Product details</h2>
      <label className="field">Product name<input name="title" defaultValue={product?.title ?? ''} maxLength={140} required /></label>
      <label className="field"><span id="admin-product-collection">Collection</span><select name="collection" aria-labelledby="admin-product-collection" defaultValue={product?.collection ?? ''} required>
        <option value="" disabled>Choose a collection</option>
        {collections.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}
      </select></label>
      <label className="field wide">Description<textarea name="description" maxLength={3500} defaultValue={product?.description ?? ''} required={visibility === 'published'} /></label>
      <label className="field">Origin<input name="origin" defaultValue={product?.origin ?? ''} maxLength={100} /></label>
      <label className="field">Variety<input name="variety" defaultValue={product?.variety ?? ''} maxLength={80} /></label>
      <label className="field">Processing<input name="processing" defaultValue={product?.processing ?? ''} maxLength={120} /></label>
    </fieldset>

    <fieldset disabled={busy} className="panel flex flex-col gap-4" aria-labelledby="admin-product-photos">
      <div><h2 id="admin-product-photos">Photos</h2><p>Up to six JPEG, PNG or WebP photos. The cover appears first in the shop.</p></div>
      <label className="field max-w-md">Upload photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} disabled={photos.length >= maxProductPhotos} /></label>
      {photoError && <p className="status-note status-error" role="alert">{photoError}</p>}
      <div className="admin-photo-list">
        {photos.map((photo, index) => <div className="border border-coffee-200 p-3 min-w-0" key={photo.key}>
          <h3 className="text-lg">{index === 0 ? 'Cover photo' : 'Gallery photo'}</h3>
          <StoredOrLocalPhoto photo={photo} />
          <label className="field mt-3">Photo description<input required value={photo.alt} maxLength={200}
            onChange={event => setPhotos(photos.map(item => item.key === photo.key ? { ...item, alt: event.target.value } : item))} /></label>
          <div className="admin-editor-actions mt-3">
            {index !== 0 && <button type="button" className="text-link" onClick={() => setPhotos([photo, ...photos.filter(item => item.key !== photo.key)])}>Make cover</button>}
            <button type="button" className="text-link" onClick={() => { setPhotos(photos.filter(item => item.key !== photo.key)); setPhotoError(''); }}>Remove photo</button>
          </div>
        </div>)}
      </div>
    </fieldset>

    <fieldset disabled={busy} className="panel flex flex-col gap-4" aria-labelledby="admin-product-variants">
      <div><h2 id="admin-product-variants">Variants, pricing and stock</h2><p>Enter tax-inclusive INR prices. Leave the sale price blank to use the regular price.</p></div>
      {variants.map((variant, index) => <div className="form-grid border border-coffee-200 p-4" key={variant.key}>
        <div className="wide admin-editor-actions justify-between">
          <h3 className="font-semibold">{variant.sku || `Variant ${index + 1}`}</h3>
          {!variant.id && <button type="button" className="text-link" onClick={() => setVariants(variants.filter(item => item.key !== variant.key))}>Remove variant</button>}
        </div>
        <label className="field">SKU<input required maxLength={100} value={variant.sku} onChange={event => updateVariant(variant.key, { sku: event.target.value })} /></label>
        <label className="field">Pack size<input maxLength={80} value={variant.packSize} onChange={event => updateVariant(variant.key, { packSize: event.target.value })} /></label>
        <label className="field">Grade<input maxLength={80} value={variant.grade} onChange={event => updateVariant(variant.key, { grade: event.target.value })} /></label>
        <label className="field">Roast level<input maxLength={80} value={variant.roast} onChange={event => updateVariant(variant.key, { roast: event.target.value })} /></label>
        <label className="field">Format<input maxLength={80} value={variant.format} onChange={event => updateVariant(variant.key, { format: event.target.value })} /></label>
        <label className="field">Units in stock<input type="number" required min={0} max={2147483647} step={1} value={variant.stock} onChange={event => updateVariant(variant.key, { stock: event.target.value })} /></label>
        <label className="field">Regular price (₹)<input required inputMode="decimal" maxLength={15} value={variant.price} onChange={event => updateVariant(variant.key, { price: event.target.value })} /></label>
        <label className="field">Sale price (₹)<input inputMode="decimal" maxLength={15} value={variant.salePrice} onChange={event => updateVariant(variant.key, { salePrice: event.target.value })} /></label>
        <label className="wide flex gap-2 items-center"><input type="checkbox" checked={variant.active} onChange={event => updateVariant(variant.key, { active: event.target.checked })} /> Active in shop</label>
      </div>)}
      <div><button type="button" className="action action-outline" onClick={addVariant} disabled={variants.length >= 30}>Add variant</button></div>
    </fieldset>

    <fieldset disabled={busy} className="panel form-grid" aria-labelledby="admin-product-visibility">
      <h2 id="admin-product-visibility" className="wide">Visibility</h2>
      <label className="field"><span id="admin-product-listing-status">Listing status</span><select aria-labelledby="admin-product-listing-status" value={visibility} onChange={event => setVisibility(event.target.value)}>
        <option value="draft">Draft</option><option value="published">Published</option>
      </select></label>
      <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={product?.featured} /> Feature on homepage when published</label>
      {message && <p className="wide status-note status-error" role="alert">{message}</p>}
      <div className="wide admin-editor-actions">
        <button type="submit" className="action" disabled={busy}>{busy ? 'Saving…' : visibility === 'published' ? (product?.published ? 'Save changes' : 'Publish product') : 'Save draft'}</button>
        <Link className="text-link" href="/admin/products/">Cancel</Link>
      </div>
    </fieldset>
  </form>;
}

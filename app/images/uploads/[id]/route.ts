import { currentAdmin } from '@/lib/admin-auth';
import { query, databaseConfigured } from '@/lib/db';
import { productUploadPath, uuidPattern } from '@/lib/product-media';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id) || !databaseConfigured()) return new Response(null, { status: 404 });
  const { rows: [photo] } = await query<{ content: Buffer; published: boolean }>(`
    SELECT u.content, p.published FROM product_image_uploads u JOIN products p ON p.id = u.product_id
    JOIN product_images g ON g.product_id = p.id AND g.path = $2 WHERE u.id = $1`, [id, productUploadPath(id)],
  );
  if (!photo || (!photo.published && !await currentAdmin())) return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return new Response(new Uint8Array(photo.content), {
    headers: {
      'Content-Type': 'image/webp',
      'Content-Length': String(photo.content.length),
      'Cache-Control': photo.published ? 'public, max-age=0, must-revalidate' : 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

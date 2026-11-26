import { revalidatePath } from 'next/cache';
import { currentAdmin } from '@/lib/admin-auth';
import { saveAdminProduct } from '@/lib/admin-products';
import { apiError, RequestError, requireOrigin } from '@/lib/http';
import { maxProductUploadBytes } from '@/lib/product-media';

const requestLimit = maxProductUploadBytes + 128 * 1024;

export async function POST(request: Request) {
  try {
    requireOrigin(request);
    if (!await currentAdmin()) throw new RequestError('Sign in to manage products.', 401);
    const contentType = request.headers.get('content-type');
    if (!request.body || !contentType?.startsWith('multipart/form-data;')) throw new RequestError('Submit the product form.', 415);
    if (Number(request.headers.get('content-length')) > requestLimit) throw new RequestError('Photos can total up to 4 MB per save.', 413);
    let size = 0;
    const bounded = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        size += chunk.length;
        if (size > requestLimit) throw new Error('Size limit exceeded.');
        controller.enqueue(chunk);
      },
    }));
    let form: FormData;
    let data: unknown;
    try {
      form = await new Response(bounded, { headers: { 'Content-Type': contentType } }).formData();
      const details = form.get('product');
      if (typeof details !== 'string' || details.length > 80_000) throw new Error('Invalid details.');
      data = JSON.parse(details);
    } catch {
      if (size > requestLimit) throw new RequestError('Photos can total up to 4 MB per save.', 413);
      throw new RequestError('The product form could not be read.');
    }
    const id = await saveAdminProduct(data, form);
    revalidatePath('/');
    revalidatePath('/sitemap.xml');
    return Response.json({ id });
  } catch (error) {
    return apiError(error);
  }
}

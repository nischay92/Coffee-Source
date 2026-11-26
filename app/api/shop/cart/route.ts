import { NextResponse } from 'next/server';
import { getCartLines, indiaShipping, parseItems, variantLabel } from '@/lib/catalogue';
import { databaseConfigured } from '@/lib/db';
import { apiError, readJSON, RequestError, requireOrigin } from '@/lib/http';
import { razorpayCredentials } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const items = parseItems((await readJSON(request)).items);
    if (!databaseConfigured()) throw new RequestError('The shop is temporarily unavailable.', 503);
    const lines = await getCartLines(items);
    const shipping = indiaShipping();
    return NextResponse.json({
      lines: lines.map(line => ({ ...line, label: variantLabel(line) })), shipping,
      available: shipping !== null && Boolean(razorpayCredentials()),
      test: razorpayCredentials()?.id.startsWith('rzp_test_') ?? false,
    });
  } catch (error) {
    return apiError(error);
  }
}

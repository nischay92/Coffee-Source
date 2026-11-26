'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import type { ReactNode } from 'react';

export default function StorefrontChrome({ children }: { children: ReactNode }) {
  return useSelectedLayoutSegment() === 'admin' ? null : children;
}

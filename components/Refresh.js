'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Refresh() {
  const router = useRouter();
  useEffect(() => { const t = setTimeout(() => router.refresh(), 2000); return () => clearTimeout(t); });
  return null;
}

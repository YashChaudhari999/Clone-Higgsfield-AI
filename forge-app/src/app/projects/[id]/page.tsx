'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function SingleProjectRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    if (resolvedParams?.id) {
      router.replace(`/dashboard/projects?id=${resolvedParams.id}`);
    } else {
      router.replace('/dashboard/projects');
    }
  }, [resolvedParams, router]);

  return <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />;
}

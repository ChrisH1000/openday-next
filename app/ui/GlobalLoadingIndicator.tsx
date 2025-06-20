"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/app/ui/LoadingContext';
import Spinner from '@/app/ui/Spinner';

export default function GlobalLoadingIndicator() {
  const { loading, setLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname, setLoading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Spinner className="h-10 w-10 text-white" />
    </div>
  );
}

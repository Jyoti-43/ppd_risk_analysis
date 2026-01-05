"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../Hooks/hook';
import { selectIsLoggedIn } from '../../../redux/feature/user/userSlice';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      // router.push('/login');
      // router.push('/')
    }
  }, [mounted, isLoggedIn, router]);

  // Don't render protected content until we've checked auth on client
  if (!mounted || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
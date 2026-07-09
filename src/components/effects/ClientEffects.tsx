'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useEnquiryStore } from '@/lib/store/enquiryStore';

const SparkCursor = dynamic(
  () => import('./SparkCursor').then(m => m.SparkCursor),
  { ssr: false }
);

const GlobalAtmosphere = dynamic(
  () => import('./GlobalAtmosphere').then(m => m.GlobalAtmosphere),
  { ssr: false }
);

export function ClientEffects() {
  useEffect(() => {
    const { checkCartExpiry, setLastActive } = useEnquiryStore.getState();

    // 1. Suppress THREE.Clock deprecation warnings from the browser console
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
        return;
      }
      originalWarn(...args);
    };

    // 2. Check cart expiration on client-side mount
    checkCartExpiry();

    // 3. Keep updating the lastActive timestamp every 10 seconds while active and visible on the site
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setLastActive(Date.now());
      }
    }, 10000);

    // 4. Update on visibility and unloading changes (leaves or returns to site)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkCartExpiry();
      }
      setLastActive(Date.now());
    };

    const handleBeforeUnload = () => {
      setLastActive(Date.now());
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.warn = originalWarn;
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <GlobalAtmosphere />
      <SparkCursor />
    </>
  );
}

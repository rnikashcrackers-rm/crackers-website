'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';

export function GlobalAtmosphere() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div suppressHydrationWarning className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F7B733]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-[#172448]/40 rounded-full blur-[160px]" />
    </div>
  );
}

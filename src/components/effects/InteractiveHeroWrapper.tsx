'use client';

import React from 'react';

export function InteractiveHeroWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0B132B]" id="hero">
      {children}
    </section>
  );
}

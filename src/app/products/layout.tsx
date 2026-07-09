import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sivakasi Fireworks Catalog | Shop Premium Crackers Online',
  description: 'Browse our extensive price list of Sivakasi fireworks: sparklers, chakkars, flower pots, rockets, bombs, and multi-shots at factory-direct wholesale prices. Up to 60% discount.',
  keywords: [
    'Sivakasi fireworks price list',
    'buy sparklers online',
    'chakkars wholesale Sivakasi',
    'flower pots crackers price',
    'Diwali bombs online',
    'multishots sky shots Sivakasi',
    'green crackers catalog'
  ],
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Sivakasi Fireworks Catalog | NIKASH CRACKERS',
    description: 'Direct factory prices on premium, safety-certified fireworks. Check our latest catalog and place your booking.',
    url: 'https://rnikashcrackers.com/products',
  }
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

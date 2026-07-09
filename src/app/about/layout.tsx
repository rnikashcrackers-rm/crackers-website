import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Heritage & Factory Legacy | About NIKASH CRACKERS Sivakasi',
  description: 'NIKASH CRACKERS is committed to manufacturing high-quality, safety-certified, and eco-friendly fireworks. Read our story and values.',
  keywords: [
    'Sivakasi fireworks factory owner',
    'NIKASH CRACKERS manufacturer Sivakasi',
    'eco friendly pyrotechnics India',
    'traditional green crackers Sivakasi'
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Our Sivakasi Heritage | NIKASH CRACKERS',
    description: 'Learn about our decade-long journey of manufacturing quality and safe celebration fireworks.',
    url: 'https://rnikashcrackers.com/about',
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

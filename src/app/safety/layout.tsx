import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fireworks Safety Precautions & Handling Guide | Sivakasi Rules',
  description: 'Learn essential tips for storing, handling, and lighting fireworks safely. Protect children, follow eco-friendly green guidelines, and ensure safe celebrations.',
  keywords: [
    'how to light fireworks safely',
    'eco friendly green crackers guidelines',
    'Sivakasi crackers safety rules',
    'child safety Diwali fireworks'
  ],
  alternates: {
    canonical: '/safety',
  },
  openGraph: {
    title: 'Fireworks Safety Handling Guide | NIKASH CRACKERS',
    description: 'Practical safety instructions and tips to prevent fire hazards and ensure safe family celebrations.',
    url: 'https://rnikashcrackers.com/safety',
  }
};

export default function SafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

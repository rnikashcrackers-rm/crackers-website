import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Sivakasi Office & Wholesale Booking | NIKASH CRACKERS',
  description: 'Connect with NIKASH CRACKERS wholesale support: Call +91 78679 55841. Visit our Sivakasi-Vembakottai Main Road showroom or enquire online for custom wedding orders.',
  keywords: [
    'Sivakasi crackers wholesale contact number',
    'buy crackers directly from Sivakasi factory',
    'NIKASH CRACKERS support address',
    'bulk order fireworks Sivakasi'
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Wholesale Office | NIKASH CRACKERS',
    description: 'Get in touch for bulk orders, corporate gifting, and local distribution bookings.',
    url: 'https://rnikashcrackers.com/contact',
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

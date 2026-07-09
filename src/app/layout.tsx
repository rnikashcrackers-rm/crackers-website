import type { Metadata } from "next";
import { Cinzel, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { MarketingHead } from '@/components/layout/MarketingHead';
import "./globals.css";

import { ClientEffects } from '@/components/effects/ClientEffects';
import { CursorSparkles } from '@/components/effects/CursorSparkles';

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rnikashcrackers.com'),
  title: {
    default: "Nikash Crackers | Premium Sivakasi Fireworks & Price List Enquiry",
    template: "%s | Nikash Crackers — Sivakasi",
  },
  icons: {
    icon: [
      { url: '/logo/logo.png', type: 'image/png' },
      { url: '/logo/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo/logo.png',
    apple: '/logo/logo.png',
  },
  description: "Sivakasi's premium online crackers shopping portal. Buy premium crackers online at factory direct prices — up to 60% off MRP. Safety-certified, eco-friendly green crackers for Diwali, weddings & celebrations.",
  keywords: [
    "crackers", "fireworks", "Sivakasi", "Diwali", "premium crackers", "Nikash Crackers", "Nikash Crackers", "rnikashcrackers.com",
    "eco-friendly fireworks", "green crackers", "pyrotechnics", "Tamil Nadu crackers",
    "buy crackers online", "Sivakasi crackers factory price", "Diwali crackers 2026",
    "cheapest crackers online", "crackers wholesale Sivakasi", "online crackers Tamil Nadu",
    "wedding crackers", "festival fireworks India", "crackers home delivery",
    "crackers near me", "best crackers shop online",
  ],
  authors: [{ name: "Nikash Crackers", url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rnikashcrackers.com' }],
  creator: "Nikash Crackers",
  publisher: "Nikash Crackers",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: { canonical: '/' },
  openGraph: {
    title: "Nikash Crackers | Premium Sivakasi Fireworks — Factory Direct Prices",
    description: "Sivakasi's premium online crackers shopping. Premium, safety-certified fireworks delivered at direct factory prices. Up to 60% off MRP.",
    type: "website",
    locale: "en_IN",
    siteName: "Nikash Crackers",
    images: [{ url: "/family-festive.png", width: 1200, height: 630, alt: "Nikash Crackers — Premium Sivakasi Fireworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikash Crackers | Premium Sivakasi Fireworks",
    description: "Sivakasi's premium online crackers shopping. Premium, safety-certified fireworks delivered from Sivakasi.",
    images: ["/family-festive.png"],
  },
  verification: { 
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "", 
    yandex: "" 
  },
  category: "E-commerce",
  other: {
    /* GEO Meta Tags for Local SEO / GEO Optimization */
    'geo.region': 'IN-TN',
    'geo.placename': 'Sivakasi, Tamil Nadu',
    'geo.position': '9.4532;77.8024',
    'ICBM': '9.4532, 77.8024',
    /* SEM / Advertising */
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${inter.variable} font-sans min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased overflow-x-hidden transition-colors duration-400`}
      >
        {/* JSON-LD: Organization + LocalBusiness for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Nikash Crackers',
                alternateName: 'Nikash Crackers',
                url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rnikashcrackers.com',
                logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rnikashcrackers.com'}/logo/logo.png`,
                foundingDate: '2020',
                description: "Sivakasi's premium online crackers shopping portal.",
                telephone: '+91-78679-55841',
                email: 'rnikashcrackers@gmail.com',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '9QCM+7FJ, Madathupatti, Kananjampatti',
                  addressLocality: 'Kananjampatti',
                  addressRegion: 'Tamil Nadu',
                  postalCode: '626128',
                  addressCountry: 'IN',
                },
                sameAs: [
                  'https://wa.me/917867955841',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                '@id': '#localbusiness',
                name: 'Nikash Crackers',
                image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rnikashcrackers.com'}/family-festive.png`,
                priceRange: '₹₹',
                telephone: '+91-78679-55841',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '9QCM+7FJ, Madathupatti, Kananjampatti',
                  addressLocality: 'Kananjampatti',
                  addressRegion: 'Tamil Nadu',
                  postalCode: '626128',
                  addressCountry: 'IN',
                },
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: '9.4532',
                  longitude: '77.8024',
                },
                areaServed: {
                  '@type': 'Country',
                  name: 'India',
                },
                openingHoursSpecification: [
                  {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    opens: '09:00',
                    closes: '20:00',
                  },
                ],
              },
            ]),
          }}
        />

        {/* JSON-LD: FAQ for AEO (Answer Engine Optimization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Where can I buy crackers online from Sivakasi?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can buy premium crackers online from Nikash Crackers at rnikashcrackers.com. We are based in Sivakasi and offer direct factory prices with up to 60% discount off MRP.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the minimum order value for crackers?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The minimum order value at Nikash Crackers is ₹2,000. We offer a wide range of crackers starting from budget-friendly single sound crackers to premium gift boxes.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Are Nikash Crackers safety certified?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, all our crackers are safety-certified and manufactured following strict quality control measures in Sivakasi. We prioritize customer safety and use eco-friendly materials.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do you deliver crackers across India?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, we deliver crackers across all major cities in India including Chennai, Bangalore, Hyderabad, Mumbai, Delhi, and more. Tamil Nadu customers enjoy expedited delivery directly from Sivakasi.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much discount do I get on Diwali crackers?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Nikash Crackers offers up to 60% off MRP on all crackers. Since we sell directly from Sivakasi, you get the best wholesale prices without any middlemen.',
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD: HowTo for ordering (AEO / Voice Search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How to Order Crackers Online from Nikash Crackers',
              description: 'Step-by-step guide to order premium Sivakasi crackers online at factory direct prices.',
              step: [
                { '@type': 'HowToStep', name: 'Browse Products', text: 'Visit our products page and browse through our extensive catalog of safety-certified crackers.', position: 1 },
                { '@type': 'HowToStep', name: 'Add to Cart', text: 'Select your favorite crackers and add them to your enquiry cart.', position: 2 },
                { '@type': 'HowToStep', name: 'Submit Order', text: 'Fill in your delivery details and submit your order. Our team will confirm via WhatsApp.', position: 3 },
                { '@type': 'HowToStep', name: 'Receive Delivery', text: 'Your crackers will be packed safely and delivered to your doorstep.', position: 4 },
              ],
            }),
          }}
        />

        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[#FFFDF9]">
            {/* Glow Blob 1: Top Left */}
            <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-[#FF6B4A]/10 to-transparent blur-[120px]" />
            {/* Glow Blob 2: Top Right */}
            <div className="absolute top-[10%] right-[-10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-[#FF5C7A]/8 to-transparent blur-[140px]" />
            {/* Glow Blob 3: Middle Left */}
            <div className="absolute top-[40%] left-[-15%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-[#FF9A6C]/8 to-transparent blur-[130px]" />
            {/* Glow Blob 4: Bottom Right */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-[#FF6B4A]/10 to-transparent blur-[120px]" />
            {/* Glow Blob 5: Bottom Left */}
            <div className="absolute bottom-[-5%] left-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-br from-[#FF9A6C]/6 to-transparent blur-[100px]" />
          </div>
          <MarketingHead />
          <ClientEffects />
          <CursorSparkles />
          <Navbar />
          <main className="pt-24 min-h-screen">
            {children}
          </main>
           <Footer />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}

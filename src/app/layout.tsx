import type { Metadata } from "next";
import { Cinzel, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { MarketingHead } from '@/components/layout/MarketingHead';

import "./globals.css";

import { ClientEffects } from '@/components/effects/ClientEffects';

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
    default: "Nikash Crackers | Sivakasi Fireworks & Price List Enquiry",
    template: "%s | Nikash Crackers | Sivakasi",
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
  description: "Sivakasi online crackers shopping portal. Buy safety-certified crackers online at direct factory prices — up to 80% off MRP for Diwali, weddings & celebrations.",
  keywords: [
    "crackers", "fireworks", "Sivakasi", "Diwali", "Nikash Crackers", "rnikashcrackers.com",
    "eco-friendly fireworks", "green crackers", "Tamil Nadu crackers",
    "buy crackers online", "Sivakasi crackers factory price",
  ],
  authors: [{ name: "Nikash Crackers", url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rnikashcrackers.com' }],
  creator: "Nikash Crackers",
  publisher: "Nikash Crackers",
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
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
        className={`${cinzel.variable} ${inter.variable} font-sans min-h-screen bg-[#0B132B] text-white antialiased overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <div className="fixed inset-0 pointer-events-none -z-50 bg-[#0B132B]" />
          <MarketingHead />
          <ClientEffects />
          <Navbar />
          <div className="pt-[84px] sm:pt-[92px]">
            <main className="min-h-screen bg-[#0B132B]">
              {children}
            </main>
          </div>
          <Footer />

          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}

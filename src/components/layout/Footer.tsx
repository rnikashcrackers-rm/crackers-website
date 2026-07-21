'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUp, Sparkles, ShieldCheck } from 'lucide-react';
import { DeepamFlameIcon, MarigoldGarlandBanner } from '@/components/ui/TraditionalDeepamGarland';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Festival Combos', href: '/combos' },
    { label: 'Gift Boxes', href: '/products?category=giftbox' },
    { label: 'Sparklers & Fountains', href: '/products?category=sparklers' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Support', href: '/contact' },
    { label: 'Safety Guidelines', href: '/safety' },
    { label: 'Order Enquiry', href: '/enquiry' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Conditions', href: '/terms' },
    { label: 'Shipping Guidelines', href: '/contact' },
  ]
};

const socialLinks = [
  { icon: Phone, label: 'Call Us', href: 'tel:+917867955841' },
  { icon: MapPin, label: 'Visit Factory', href: 'https://maps.app.goo.gl/MCznWB9HQJ3xpLsN6' },
  { icon: Mail, label: 'Email Desk', href: 'mailto:rnikashcrackers@gmail.com' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer suppressHydrationWarning className="relative bg-[#0B132B] text-white border-t border-[#172448] overflow-hidden" id="footer">
      {/* Top Traditional Garland */}
      <div className="border-b border-[#172448]">
        <MarigoldGarlandBanner />
      </div>

      {/* Traditional Kolam Watermarks */}
      <div className="absolute top-10 left-6 pointer-events-none opacity-15 hidden md:block">
        <AnimatedKolam size={220} color="#F7B733" />
      </div>
      <div className="absolute bottom-10 right-6 pointer-events-none opacity-15 hidden md:block">
        <AnimatedKolam size={240} color="#F7B733" delay={0.5} />
      </div>

      <div className="relative max-w-[1300px] mx-auto px-6 pt-12 pb-10 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" suppressHydrationWarning className="inline-flex items-center gap-3 group select-none">
              <DeepamFlameIcon className="w-6 h-6" />
              <div className="relative w-9 h-9 bg-white rounded-full p-0.5 border border-[#F7B733]/60 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Image src="/logo/logo.png" alt="Nikash Crackers Logo" width={34} height={34} className="object-contain w-full h-full rounded-full" />
              </div>

              <div className="flex flex-col text-left">
                <span className="font-display text-base sm:text-lg font-black tracking-tight text-white leading-none">
                  NIKASH CRACKERS
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#F7B733] font-extrabold leading-none mt-1">
                  SIVAKASI FACTORY DIRECT
                </span>
              </div>
            </Link>
            
            <p className="text-slate-300 max-w-sm leading-relaxed text-xs sm:text-sm">
              Sivakasi&apos;s direct factory online fireworks portal. Providing CSIR-NEERI green certified fireworks with direct factory pricing and safe pan-India shipping.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl bg-[#172448] px-3.5 py-2 text-xs font-bold text-[#F7B733] border border-[#F7B733]/30">
              <ShieldCheck size={16} /> 100% CSIR-NEERI Green Crackers Certified
            </div>

            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a key={social.label} href={social.href} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-[#101A36] border border-[#172448] flex items-center justify-center text-[#F7B733] hover:bg-[#F7B733] hover:text-[#101A36] transition-all duration-300"
                  aria-label={social.label} target={social.href.startsWith('http') ? '_blank' : undefined}>
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-black text-[#F7B733] mb-5 uppercase text-xs tracking-widest flex items-center gap-2">
              <DeepamFlameIcon className="w-4 h-4" /> Catalogue
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-300 hover:text-[#F7B733] transition-colors text-xs sm:text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-black text-[#F7B733] mb-5 uppercase text-xs tracking-widest flex items-center gap-2">
              <DeepamFlameIcon className="w-4 h-4" /> Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-300 hover:text-[#F7B733] transition-colors text-xs sm:text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-black text-[#F7B733] mb-5 uppercase text-xs tracking-widest flex items-center gap-2">
              <DeepamFlameIcon className="w-4 h-4" /> Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-2.5 text-xs sm:text-sm text-slate-300">
                <MapPin size={15} className="shrink-0 text-[#F7B733] mt-0.5" />
                <span>9QCM+7FJ, Madathupatti, Kananjampatti, Sivakasi, Tamil Nadu 626128</span>
              </li>
              <li>
                <a href="tel:+917867955841" className="flex gap-2.5 text-xs sm:text-sm text-slate-300 hover:text-[#F7B733]">
                  <Phone size={15} className="shrink-0 text-[#F7B733]" />
                  <span>+91 78679 55841</span>
                </a>
              </li>
              <li>
                <a href="mailto:rnikashcrackers@gmail.com" className="flex gap-2.5 text-xs sm:text-sm text-slate-300 hover:text-[#F7B733]">
                  <Mail size={15} className="shrink-0 text-[#F7B733]" />
                  <span>rnikashcrackers@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 border-y border-[#172448] mb-6">
          {['🛡️ 100% Safety Certified', '🌿 Eco-Friendly Options', '🏭 Direct Factory Price', '📦 Secure Transport Packaging'].map((badge) => (
            <span key={badge} className="text-[10px] sm:text-xs font-bold text-[#F7B733] uppercase tracking-wider">{badge}</span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium">
          <p suppressHydrationWarning>© {currentYear} Nikash Crackers (Sivakasi). All rights reserved.</p>
          <div suppressHydrationWarning className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#F7B733] transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <motion.button onClick={scrollToTop} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#101A36] border border-[#172448] flex items-center justify-center text-[#F7B733] hover:bg-[#F7B733] hover:text-[#101A36] shadow-md transition-colors"
        aria-label="Back to top">
        <ArrowUp size={14} />
      </motion.button>
    </footer>
  );
}

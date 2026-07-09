'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUp, Sparkles } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?category=new' },
    { label: 'Best Sellers', href: '/products?category=best' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety Guidelines', href: '/safety' },
    { label: 'Enquiry Cart', href: '/enquiry' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Shipping Info', href: '/contact' },
  ]
};

const socialLinks = [
  { icon: Phone, label: 'Call Us', href: 'tel:+917867955841', color: 'hover:text-[#8C1D1D] hover:border-[#8C1D1D]' },
  { icon: MapPin, label: 'Visit Factory', href: 'https://maps.app.goo.gl/MCznWB9HQJ3xpLsN6', color: 'hover:text-[#FF8A6B] hover:border-[#FF8A6B]' },
  { icon: Mail, label: 'Email', href: 'mailto:rnikashcrackers@gmail.com', color: 'hover:text-[#8C1D1D] hover:border-[#8C1D1D]' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer suppressHydrationWarning className="relative bg-white/40 backdrop-blur-md border-t border-[#E8E2D8] overflow-hidden" id="footer">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF8A6B]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-[1300px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" suppressHydrationWarning className="inline-flex items-center gap-1 mb-6 group select-none">
              {/* Left Laurel Wreath branch */}
              <svg className="w-6 h-6 text-[#FF8A6B] opacity-90 transition-transform group-hover:rotate-[-5deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 19C8.5 17 9.5 13.5 9.5 10C9.5 6.5 7.5 3.5 5 1.5" strokeLinecap="round"/>
                <path d="M4.5 14.5C6.2 14 7.8 12.5 8.2 10.5" strokeLinecap="round"/>
                <path d="M5 10.5C6.8 10 8.2 8.5 8.5 6.5" strokeLinecap="round"/>
                <path d="M5.8 6.5C7.3 6 8.3 4.5 8.5 3" strokeLinecap="round"/>
                <path d="M7 16.5C8.8 16 10.2 14.5 10.5 12.5" strokeLinecap="round"/>
              </svg>

              {/* Central Text Column */}
              <div className="flex flex-col text-center px-1">
                <span className="font-display text-sm sm:text-base font-black tracking-tight text-[#8C1D1D] leading-none">
                  NIKASH CRACKERS
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#FF8A6B] font-extrabold leading-none mt-1">
                  SIVAKASI
                </span>
              </div>

              {/* Right Laurel Wreath branch (mirrored) */}
              <svg className="w-6 h-6 text-[#FF8A6B] opacity-90 scale-x-[-1] transition-transform group-hover:rotate-[-5deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 19C8.5 17 9.5 13.5 9.5 10C9.5 6.5 7.5 3.5 5 1.5" strokeLinecap="round"/>
                <path d="M4.5 14.5C6.2 14 7.8 12.5 8.2 10.5" strokeLinecap="round"/>
                <path d="M5 10.5C6.8 10 8.2 8.5 8.5 6.5" strokeLinecap="round"/>
                <path d="M5.8 6.5C7.3 6 8.3 4.5 8.5 3" strokeLinecap="round"/>
                <path d="M7 16.5C8.8 16 10.2 14.5 10.5 12.5" strokeLinecap="round"/>
              </svg>
            </Link>
            
            <p className="text-[#5C544C] max-w-sm mb-6 leading-relaxed text-sm">
              Sivakasi&apos;s premium online crackers shopping portal. Lighting up millions of homes with uncompromising safety and premium quality.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a key={social.label} href={social.href} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#5C544C] transition-all duration-300 ${social.color}`}
                  aria-label={social.label} target={social.href.startsWith('http') ? '_blank' : undefined}>
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#8C1D1D] mb-6 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={11} className="text-[#FF8A6B]" /> Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-[#5C544C] hover:text-[#8C1D1D] transition-colors text-sm inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-px bg-[#8C1D1D] transition-all duration-300" />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#8C1D1D] mb-6 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={11} className="text-[#FF8A6B]" /> Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-[#5C544C] hover:text-[#8C1D1D] transition-colors text-sm inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-px bg-[#8C1D1D] transition-all duration-300" />{link.label}
                </Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#8C1D1D] mb-6 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={11} className="text-[#FF8A6B]" /> Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-2.5 text-sm text-[#5C544C]"><MapPin size={15} className="shrink-0 text-[#FF8A6B] mt-0.5" /><span>Nikash Crackers, Sivakasi, Tamil Nadu - 626123.</span></li>
              <li><a href="tel:+917867955841" className="flex gap-2.5 text-sm text-[#5C544C] hover:text-[#8C1D1D]"><Phone size={15} className="shrink-0 text-[#FF8A6B]" /><span>+91 78679 55841</span></a></li>
              <li><a href="mailto:rnikashcrackers@gmail.com" className="flex gap-2.5 text-sm text-[#5C544C] hover:text-[#8C1D1D]"><Mail size={15} className="shrink-0 text-[#FF8A6B]" /><span>rnikashcrackers@gmail.com</span></a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-[#E8E2D8] mb-8">
          {['🛡️ 100% Safety Certified', '🌿 Eco-Friendly Options', '🏭 Direct Factory Price', '📦 Secure Packaging'].map((badge) => (
            <span key={badge} className="text-[10px] font-bold text-[#5C544C] uppercase tracking-wider">{badge}</span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[#5C544C] text-xs font-semibold">
          <p suppressHydrationWarning>© {currentYear} Nikash Crackers (Nikash Crackers). All rights reserved.</p>
          <div suppressHydrationWarning className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#8C1D1D] transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <motion.button onClick={scrollToTop} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[#5C544C] hover:text-[#8C1D1D] hover:border-[#8C1D1D] shadow-sm transition-colors"
        aria-label="Back to top">
        <ArrowUp size={14} />
      </motion.button>
    </footer>
  );
}

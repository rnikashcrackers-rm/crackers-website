'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Phone, Sparkles } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/safety', label: 'Safety' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const items = useEnquiryStore((state) => state.items);
  const itemCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <>
      <header suppressHydrationWarning
        className={`fixed left-4 right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 z-50 transition-all duration-500 max-w-[1300px] mx-auto ${
          isScrolled 
            ? 'top-2 py-2.5 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full' 
            : 'top-4 py-3.5 bg-white/60 backdrop-blur-lg border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-full'
        }`}>
        <div suppressHydrationWarning className="w-full px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo with decorative Laurel Wreath */}
          <Link href="/" suppressHydrationWarning className="flex items-center gap-1 group select-none" id="nav-logo">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" id="nav-desktop">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`relative px-4 py-2 text-xs lg:text-sm font-bold transition-all rounded-full ${
                    isActive ? 'text-[#8C1D1D]' : 'text-[#7C746C] hover:text-[#2D241E]'
                  }`}>
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="nav-indicator" 
                      className="absolute inset-0 bg-[#000000]/5 border border-[#000000]/5 rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Options */}
          <div className="flex items-center gap-3">
            {/* Phone link */}
            <a href="tel:+917867955841" className="hidden lg:flex items-center gap-1.5 text-xs lg:text-sm font-black text-[#5C544C] hover:text-[#8C1D1D] transition-colors">
              <Phone size={14} className="text-[#FF8A6B]" />
              <span>+91 78679 55841</span>
            </a>
            
            <div className="hidden lg:block w-px h-5 bg-[#E8E2D8]" />

            {/* Cart Button */}
            <Link href="/enquiry" id="nav-enquiry-btn">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 border border-black/5 hover:border-[#FF8A6B] text-[#2D241E] text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors">
                <ShoppingCart size={13} className="text-[#8C1D1D]" />
                <span>
                  {mounted && itemCount > 0 ? `Cart (₹${totalPrice.toLocaleString('en-IN')})` : 'Cart'}
                </span>
                {mounted && itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#8C1D1D] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                    {itemCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Toggle */}
            <motion.button whileTap={{ scale: 0.9 }} className="md:hidden p-2 text-[#2D241E] rounded-full bg-white/50 border border-black/5"
              onClick={() => setMobileMenuOpen(true)} id="nav-mobile-toggle" aria-label="Open navigation menu">
              <Menu size={18} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-[360px] z-[100] bg-[#FFFDF9] border-l border-[#E8E2D8] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FF8A6B]" />
                  <span className="font-display font-black text-base text-[#8C1D1D]">Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-black/5" aria-label="Close navigation menu">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-1.5">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link href={link.href} onClick={() => setMobileMenuOpen(false)}
                      className={`block text-xl font-display font-bold py-3 px-4 rounded-xl transition-all ${
                        pathname === link.href ? 'text-[#8C1D1D] bg-[#8C1D1D]/5' : 'text-[#2D241E] hover:bg-black/5'
                      }`}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto p-6 border-t border-[#E8E2D8] space-y-3">
                <a href="tel:+917867955841" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white border border-[#E8E2D8] text-sm font-bold text-[#5C544C] hover:border-[#8C1D1D] transition-colors">
                  <Phone size={14} className="text-[#FF8A6B]" /> +91 78679 55841
                </a>
                <Link href="/enquiry" onClick={() => setMobileMenuOpen(false)} className="block">
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2">
                    <ShoppingCart size={14} /> View Cart {mounted && itemCount > 0 && <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs font-black">{itemCount}</span>}
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

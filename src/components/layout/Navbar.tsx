'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { DeepamFlameIcon, MarigoldGarlandBanner } from '@/components/ui/TraditionalDeepamGarland';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/combos', label: 'Combos' },
  { href: '/about', label: 'About Us' },
  { href: '/safety', label: 'Safety' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const items = useEnquiryStore((state) => state.items);
  const getTotal = useEnquiryStore((state) => state.getTotal);

  const itemCount = items.length;
  const totalPrice = getTotal();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => { setIsScrolled(window.scrollY > 15); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        suppressHydrationWarning
        className={`fixed left-2 right-2 sm:left-4 sm:right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 z-50 transition-all duration-300 max-w-[1300px] mx-auto ${
          isScrolled 
            ? 'top-2 py-2 bg-[#101A36]/95 backdrop-blur-xl border border-[#F7B733]/40 shadow-2xl rounded-full' 
            : 'top-3 py-2.5 bg-[#101A36]/90 backdrop-blur-md border border-[#172448] shadow-xl rounded-full'
        }`}
      >
        <div suppressHydrationWarning className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between relative">
          
          {/* Left: Deepam & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 text-[#F7B733] rounded-full bg-[#0B132B] border border-[#172448] min-h-[40px] min-w-[40px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
              id="nav-mobile-toggle"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </motion.button>
            <DeepamFlameIcon className="w-5 h-5 hidden sm:inline-flex" />
          </div>

          {/* Logo with Brand Title */}
          <Link
            href="/"
            suppressHydrationWarning
            className="flex items-center gap-2.5 group select-none"
            id="nav-logo"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full p-0.5 border border-[#F7B733]/60 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Image
                src="/logo/logo.png"
                alt="Nikash Crackers Logo"
                width={36}
                height={36}
                className="object-contain w-full h-full rounded-full"
              />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-display text-sm sm:text-base font-black tracking-tight text-white leading-none group-hover:text-[#F7B733] transition-colors">
                NIKASH CRACKERS
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-[#F7B733] font-extrabold leading-none mt-1">
                SIVAKASI FACTORY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" id="nav-desktop">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-bold transition-all rounded-full ${
                    isActive ? 'text-[#F7B733] font-black' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-[#F7B733]/15 border border-[#F7B733]/40 rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Options */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+917867955841"
              className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-[#F7B733] hover:text-white transition-colors"
            >
              <Phone size={14} className="text-[#F7B733]" />
              <span>+91 78679 55841</span>
            </a>
            
            <div className="hidden xl:block w-px h-5 bg-[#172448]" />

            {/* Cart Button */}
            <Link href="/enquiry" id="nav-enquiry-btn">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#F7B733] text-[#101A36] text-xs font-extrabold shadow-md hover:bg-[#FFD05C] transition-colors border border-[#FFF0BF] min-h-[38px]"
              >
                <ShoppingCart size={14} className="text-[#101A36]" />
                <span>
                  {mounted && itemCount > 0
                    ? `Cart (${itemCount}) • ₹${totalPrice.toLocaleString('en-IN')}`
                    : 'Cart'}
                </span>
              </motion.button>
            </Link>

            <DeepamFlameIcon className="w-5 h-5 hidden sm:inline-flex" />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-[#0B132B]/80 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[340px] z-[100] bg-[#0B132B] border-r border-[#172448] flex flex-col shadow-2xl text-white"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#172448]">
                <div className="flex items-center gap-2">
                  <DeepamFlameIcon className="w-6 h-6" />
                  <span className="font-display font-black text-base text-white">NIKASH CRACKERS</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#172448] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col p-6 gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-lg font-display font-bold py-3 px-4 rounded-xl transition-all ${
                        pathname === link.href
                          ? 'text-[#101A36] bg-[#F7B733] font-black'
                          : 'text-slate-200 hover:bg-[#172448] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto p-6 border-t border-[#172448] space-y-3">
                <a
                  href="tel:+917867955841"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#172448] border border-[#F7B733]/30 text-sm font-bold text-[#F7B733] min-h-[48px]"
                >
                  <Phone size={16} /> +91 78679 55841
                </a>
                <Link href="/enquiry" onClick={() => setMobileMenuOpen(false)} className="block">
                  <button className="w-full py-3.5 rounded-xl bg-[#F7B733] text-[#101A36] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 min-h-[48px]">
                    <ShoppingCart size={16} /> View Cart {mounted && itemCount > 0 && <span>({itemCount}) • ₹{totalPrice.toLocaleString('en-IN')}</span>}
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

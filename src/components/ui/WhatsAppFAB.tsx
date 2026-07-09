'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFAB() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const msg = encodeURIComponent("Hi NIKASH CRACKERS! I'm interested in your products. Please share details.");
    window.open(`https://wa.me/917867955841?text=${msg}`, '_blank');
  };

  return (
    <div suppressHydrationWarning className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="bg-white dark:bg-[#1C1C18] text-[var(--text)] px-4 py-2.5 rounded-2xl shadow-2xl border border-[var(--border)] text-sm font-semibold whitespace-nowrap"
          >
            Chat with us! 💬
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.6)] transition-shadow"
        aria-label="Chat on WhatsApp"
        id="whatsapp-fab"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <MessageCircle size={24} fill="white" />
      </motion.button>
    </div>
  );
}

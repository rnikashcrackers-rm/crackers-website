'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold font-display mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-[var(--text-muted)] space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">2. Use of Service</h2>
            <p>You agree to use our services only for lawful purposes. You are prohibited from any use of the service that would constitute a violation of any applicable law or regulation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">3. Product Information</h2>
            <p>While we strive to provide accurate product information, NIKASH CRACKERS does not warrant that product descriptions or other content are accurate, complete, reliable, or error-free.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">4. Shipping & Delivery</h2>
            <p>Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or local regulations regarding the transport of fireworks.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">5. Modifications</h2>
            <p>NIKASH CRACKERS reserves the right to change these terms at any time without notice. Your continued use of the site following any changes constitutes your acceptance of the new terms.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

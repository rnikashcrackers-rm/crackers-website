'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold font-display mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-[var(--text-muted)] space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">1. Information Collection</h2>
            <p>We collect information you provide directly to us when you make an enquiry or sign up for our services. This may include your name, phone number, and location.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">2. Use of Information</h2>
            <p>We use the information we collect to process your enquiries, communicate with you, and improve our services. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">4. Cookies</h2>
            <p>Our website may use cookies to enhance your browsing experience and analyze site traffic.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">5. Contact Us</h2>
            <p>If you have any questions about our Privacy Policy, please contact us at rnikashcrackers@gmail.com.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, label: 'Visit Us', value: '9QCM+7FJ, Madathupatti, Kananjampatti, Tamil Nadu 626128', link: 'https://maps.app.goo.gl/MCznWB9HQJ3xpLsN6' },
  { icon: Phone, label: 'Call Us', value: '+91 78679 55841', link: 'tel:+917867955841' },
  { icon: Mail, label: 'Email Us', value: 'rnikashcrackers@gmail.com', link: 'mailto:rnikashcrackers@gmail.com' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us instantly', link: 'https://wa.me/917867955841' },
];

const workingHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: '10:00 AM - 2:00 PM' },
  { day: 'Festival Season', hours: '8:00 AM - 9:00 PM' },
];

const faqItems = [
  { q: 'What is the minimum order amount?', a: 'We accept orders starting from ₹500. For bulk orders above ₹10,000, special discounts are available.' },
  { q: 'Do you deliver across India?', a: 'Yes! We deliver to all major cities and towns across India. Delivery charges vary based on location and order size.' },
  { q: 'Are your crackers safe for children?', a: 'We have a dedicated Kids Special range with low-noise, low-smoke crackers designed specifically for children. All products are safety-certified.' },
  { q: 'Can I return or exchange products?', a: 'Returns are accepted within 24 hours of delivery for damaged or incorrect items. Please contact us with photos of the issue.' },
  { q: 'Do you offer bulk/wholesale pricing?', a: 'Absolutely! We offer special wholesale pricing for bulk orders, events, and wedding celebrations. Contact us for a custom quote.' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Security Verification (Math Challenge)
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityError, setSecurityError] = useState('');

  const generateChallenge = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNumA(a);
    setNumB(b);
    setSecurityAnswer('');
    setSecurityError('');
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side math verification to save API requests
    if (Number(securityAnswer) !== numA + numB) {
      setSecurityError('Incorrect answer. Please solve the security check to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          numA,
          numB,
          securityAnswer,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
        generateChallenge();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSecurityError(errorData.error || 'Failed to submit form. Please try again.');
        generateChallenge();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSecurityError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--color-coral)]/40 bg-[var(--color-coral)]/10 text-[var(--color-coral)] text-xs font-black tracking-[0.4em] uppercase mb-8">
            <Sparkles size={14} /> Get in Touch
          </motion.span>
          
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-display font-bold leading-[0.9] mb-6 tracking-tighter">
            Contact <span className="text-gradient-coral text-glow">Us</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Have a question or need a custom order? We&apos;re here to help make your celebration extraordinary.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, i) => (
            <motion.a key={info.label} href={info.link} target={info.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 group cursor-pointer hover:border-[var(--color-coral)]/40">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <info.icon size={24} />
              </div>
              <h3 className="font-bold text-[var(--text)] mb-1">{info.label}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{info.value}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-display font-bold text-[var(--text)] mb-2">Send Us a Message</h2>
            <p className="text-[var(--text-muted)] mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3">Message Sent! 🎆</h3>
                  <p className="text-[var(--text-muted)] mb-8">Thank you for reaching out. Our team will respond within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold text-sm">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Full Name *</label>
                      <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-coral)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                        placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Email *</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-coral)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                        placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-coral)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Subject *</label>
                      <select required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-coral)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all">
                        <option value="">Select a topic</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Bulk Order">Bulk / Wholesale Order</option>
                        <option value="Wedding Order">Wedding / Event Order</option>
                        <option value="Product Query">Product Information</option>
                        <option value="Delivery Query">Delivery & Shipping</option>
                        <option value="Complaint">Complaint / Feedback</option>
                        <option value="Partnership">Partnership / Business</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Message *</label>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-coral)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all resize-none"
                      placeholder="Tell us about your requirements..." />
                  </div>

                  {/* Honeypot field (hidden from human users, filled by bots) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="website">Website Address</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  {/* Math Challenge (Captcha) */}
                  <div className="grid sm:grid-cols-2 gap-5 items-end">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                        Security Check *
                      </label>
                      <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] select-none">
                        <span>What is <strong className="text-[var(--color-coral)]">{numA} + {numB}</strong>?</span>
                      </div>
                    </div>
                    <div>
                      <input
                        required
                        type="number"
                        value={securityAnswer}
                        onChange={(e) => {
                          setSecurityAnswer(e.target.value);
                          if (securityError) setSecurityError('');
                        }}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-coral)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all"
                        placeholder="Enter the sum"
                      />
                    </div>
                  </div>
                  {securityError && (
                    <p className="text-red-500 text-xs font-semibold">{securityError}</p>
                  )}

                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold flex items-center justify-center gap-3 shadow-lg disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Map + Working Hours */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            {/* Google Map */}
            <div className="glass-card rounded-3xl overflow-hidden h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.892019!2d77.7838267!3d9.3693785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06c93118e0dddd%3A0x815b17a8b769c2e3!2sR-Nikash+Crackers!5e0!3m2!1sen!2sin!4v1718220000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Nikash Crackers Location"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Working Hours */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text)] text-lg">Working Hours</h3>
                  <p className="text-xs text-[var(--text-muted)]">We&apos;re available during these hours</p>
                </div>
              </div>
              <div className="space-y-3">
                {workingHours.map((wh) => (
                  <div key={wh.day} className="flex items-center justify-between py-2 border-b border-[var(--border)]/50 last:border-0">
                    <span className="text-sm font-medium text-[var(--text)]">{wh.day}</span>
                    <span className="text-sm text-[var(--color-coral)] font-bold">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick WhatsApp CTA */}
            <a href="https://wa.me/917867955841" target="_blank" rel="noopener noreferrer">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl p-6 flex items-center gap-4 cursor-pointer shadow-lg">
                <MessageCircle size={32} className="text-white" />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">Need Instant Help?</h4>
                  <p className="text-white/80 text-sm">Chat with us on WhatsApp for quick responses</p>
                </div>
                <ArrowRight size={20} className="text-white" />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[var(--surface-high)] border-t border-[var(--border)]/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-coral)] uppercase tracking-[0.4em] mb-6">Common Questions</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text)] tracking-tighter">Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-bold text-[var(--text)] pr-4">{faq.q}</span>
                  <motion.span animate={{ rotate: expandedFaq === i ? 45 : 0 }} className="text-[var(--color-coral)] text-2xl shrink-0 font-light">+</motion.span>
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

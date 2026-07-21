'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, PackageOpen, Sparkles, ShoppingCart, CheckCircle2, Mail, Phone, MapPin, User, FileText, Download, AlertCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatOrderDate } from '@/lib/utils';

export default function EnquiryPage() {
  const items = useEnquiryStore((state) => state.items);
  const { removeItem, updateQuantity, getTotal, getSavings, clearCart } = useEnquiryStore.getState();
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '', state: '', district: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'skipped' | 'failed'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);
  const [receiptStatus, setReceiptStatus] = useState<'idle' | 'generating' | 'downloaded' | 'failed'>('idle');
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; type: 'burst' | 'fountain' | 'spin' | 'sparkle' }>>([]);

  const [settings, setSettings] = useState<any>({
    min_order_value: '2000',
  });
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => { if (data) setSettings(data); })
      .catch(err => console.error('Failed to load settings:', err));

    fetch('/api/bank-accounts')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setBankAccounts(data); })
      .catch(err => console.error('Failed to load bank accounts:', err));
  }, []);

  // Scroll to top of the page on step transitions (essential for mobile usability)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [step]);

  // Continuous background fireworks on successful order
  useEffect(() => {
    if (step === 4 && orderResult) {
      // 1. Celebratory confetti shower
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FF8A6B', '#F4E296', '#F43F5E', '#10B981', '#FF9F1C']
        });
      });

      // 2. Setup periodic firework bursts around the screen
      const fireworkTypes = ['burst', 'fountain', 'spin', 'sparkle'] as const;
      const interval = setInterval(() => {
        const id = Date.now() + Math.random();
        const x = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800);
        const y = Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400);
        const type = fireworkTypes[Math.floor(Math.random() * fireworkTypes.length)];
        setBursts(prev => [...prev.slice(-8), { id, x, y, type }]);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step, orderResult]);

  const removeBurst = (id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  const minOrderValue = parseInt(settings.min_order_value) || 2000;

  // Monitor order total - if it drops below minOrderValue, force return to Step 1
  useEffect(() => {
    if (getTotal() < minOrderValue && step > 1 && step < 4) {
      setStep(1);
    }
  }, [items, getTotal, step, minOrderValue]);

  const goToStep = (nextStep: number) => {
    setSubmitError(null);
    setStep(nextStep);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setSubmitError(null);
    setEmailStatus('idle');
    setEmailErrorMessage(null);
    
    try {
      const orderItems = items.map(item => ({
        name: item.product.name_en, quantity: item.quantity,
        price: item.product.price, mrp: item.product.mrp,
        category: item.product.category,
      }));
      
      const orderValue = getTotal();
      const packingCharges = Math.round(orderValue * 0.03);
      const grandTotal = orderValue + packingCharges;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerInfo.name, customer_email: customerInfo.email,
          customer_phone: customerInfo.phone, customer_address: customerInfo.address,
          customer_city: customerInfo.city, customer_pincode: customerInfo.pincode,
          customer_state: customerInfo.state, customer_district: customerInfo.district,
          items: orderItems, subtotal: getTotal() + getSavings(),
          discount_total: getSavings(), total_amount: grandTotal,
          payment_method: 'bank_transfer',
          notes: `Includes 3% packing charges (₹${packingCharges.toLocaleString('en-IN')}) on order value (₹${orderValue.toLocaleString('en-IN')})`,
        }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response. The server might be unreachable.');
      }
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to place order. Please try again.');
      }
      
      setOrderResult(data);
      setStep(4);
      setEmailStatus('sending');
      setReceiptStatus('generating');

      // 1. Generate PDF & Prepare Base64
      let pdfBase64Data = null;
      try {
        const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
        const doc = await generateReceipt({
          orderNumber: data.order_number,
          date: formatOrderDate(data.created_at),
          customerName: customerInfo.name, customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone, customerAddress: customerInfo.address,
          customerCity: customerInfo.city, customerPincode: customerInfo.pincode,
          customerState: customerInfo.state, customerDistrict: customerInfo.district,
          items: orderItems, subtotal: getTotal() + getSavings(),
          discountTotal: getSavings(), totalAmount: grandTotal,
          packingCharges: packingCharges,
        });
        
        // Convert to data URI and parse raw base64 data for attachment
        const dataUri = doc.output('datauristring');
        pdfBase64Data = dataUri.split(',')[1];
        
        // Auto-download to client device
        downloadReceipt(doc, data.order_number);
        setReceiptStatus('downloaded');
      } catch (pdfErr: any) {
        console.error('PDF generation error:', pdfErr);
        setReceiptStatus('failed');
        try {
          const { logError } = await import('@/lib/tracking');
          await logError('PDFGenerationError', pdfErr.message || String(pdfErr), pdfErr.stack, { orderNumber: data.order_number });
        } catch (trackErr) {}
      }

      // 2. Dispatch Email (with Base64 PDF attachment)
      fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerInfo.email, orderNumber: data.order_number,
          customerName: customerInfo.name, items: orderItems,
          totalAmount: grandTotal, subtotal: getTotal() + getSavings(),
          discountTotal: getSavings(),
          packingCharges: packingCharges,
          pdfBase64: pdfBase64Data,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address,
          customerCity: customerInfo.city,
          customerPincode: customerInfo.pincode,
          customerState: customerInfo.state,
          customerDistrict: customerInfo.district,
          notifyAdmin: true,
        }),
      })
      .then(async (emailRes) => {
        const emailData = await emailRes.json();
        if (emailRes.ok) {
          if (emailData.skipped) {
            setEmailStatus('skipped');
          } else {
            setEmailStatus('sent');
          }
        } else {
          setEmailStatus('failed');
          setEmailErrorMessage(emailData.error || 'Mail delivery failed.');
        }
      })
      .catch(err => {
        console.error('Email receipt dispatch error:', err);
        setEmailStatus('failed');
        setEmailErrorMessage(err instanceof Error ? err.message : String(err));
      });

      // 3. Trigger WhatsApp notification automatically
      fetch('/api/notify-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerInfo.phone,
          orderNumber: data.order_number,
          customerName: customerInfo.name,
          pdfBase64: pdfBase64Data,
        })
      })
      .then(async (waRes) => {
        const waData = await waRes.json();
        console.log('WhatsApp notification result:', waData);
      })
      .catch(err => {
        console.error('WhatsApp notification dispatch error:', err);
      });

      // 4. Track order placement analytics event
      try {
        const { trackEvent } = await import('@/lib/tracking');
        await trackEvent('order_placed', 'checkout', { orderNumber: data.order_number, totalAmount: getTotal() });
      } catch (trackErr) {}

      clearCart();
    } catch (error: any) {
      console.error('Order error:', error instanceof Error ? error.message : String(error));
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred while placing your order. Please try again.');
      
      // Log order creation failure
      try {
        const { logError } = await import('@/lib/tracking');
        await logError('OrderPlacementError', error.message || String(error), error.stack, { customerEmail: customerInfo.email });
      } catch (trackErr) {}
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareOnWhatsApp = () => {
    if (!orderResult) return;
    const orderItems = orderResult.items || [];
    const itemLines = orderItems.map((item: any) =>
      `• ${item.quantity} x ${item.name || item.product_name} — ₹${((item.price || 0) * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const msg = [
      `Hello NIKASH CRACKERS! 🙏`,
      '',
      `I have placed a cracker order on your website.`,
      '',
      `📄 *Order Reference:* ${orderResult.order_number}`,
      `👤 *Customer Name:* ${orderResult.customer_name || customerInfo.name}`,
      `📞 *Phone:* ${orderResult.customer_phone || customerInfo.phone}`,
      `📍 *Location:* ${[orderResult.customer_city || customerInfo.city, orderResult.customer_pincode || customerInfo.pincode].filter(Boolean).join(' - ')}`,
      '',
      `🛒 *Items List:*`,
      itemLines,
      '',
      `💰 *Grand Total (incl. packing):* ₹${orderResult.total_amount?.toLocaleString('en-IN')}`,
      '',
      `Please confirm receipt and final shipment tracking. Thank you! 🎆`
    ].join('\n');

    const url = `https://wa.me/917867955841?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadReceipt = async () => {
    if (!orderResult) return;
    const orderItems = items.length > 0 ? items.map(i => ({ name: i.product.name_en, quantity: i.quantity, price: i.product.price, mrp: i.product.mrp })) : (orderResult.items || []);
    const itemsTotal = orderItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const calculatedPacking = Math.round(itemsTotal * 0.03);
    const grandTotal = itemsTotal + calculatedPacking;
    
    const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
    const doc = await generateReceipt({
      orderNumber: orderResult.order_number, date: formatOrderDate(orderResult.created_at),
      customerName: orderResult.customer_name || customerInfo.name, customerEmail: orderResult.customer_email || customerInfo.email,
      customerPhone: orderResult.customer_phone || customerInfo.phone, 
      customerAddress: orderResult.customer_address || customerInfo.address,
      customerCity: orderResult.customer_city || customerInfo.city,
      customerPincode: orderResult.customer_pincode || customerInfo.pincode,
      customerState: orderResult.customer_state || customerInfo.state,
      customerDistrict: orderResult.customer_district || customerInfo.district,
      items: orderItems,
      subtotal: orderResult.subtotal || (itemsTotal + (orderResult.discount_total || 0)), 
      discountTotal: orderResult.discount_total || 0,
      totalAmount: grandTotal,
      packingCharges: calculatedPacking,
    });
    downloadReceipt(doc, orderResult.order_number);
  };

  // Step 4: Success
  if (step === 4 && orderResult) {
    return (
      <div className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-hidden z-10">
        


        {/* Traditional Hanging Lamps (Diyas) popping up / hanging down */}
        <div className="absolute top-0 inset-x-0 flex justify-between px-6 sm:px-20 pointer-events-none z-10 overflow-hidden h-32">
          {/* Left Lamp */}
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 1.2, stiffness: 100 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-12 bg-gradient-to-b from-[var(--color-coral)]/60 to-[var(--color-coral)]" />
            <svg width="28" height="28" viewBox="0 0 100 100" className="text-[var(--color-coral)] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 1.15, 0.95, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Left-Center Lamp (Hidden on small) */}
          <motion.div 
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.5, duration: 1.2, stiffness: 90 }}
            className="flex flex-col items-center hidden sm:flex"
          >
            <div className="w-0.5 h-18 bg-gradient-to-b from-[var(--color-coral)]/40 to-[var(--color-coral)]" />
            <svg width="24" height="24" viewBox="0 0 100 100" className="text-[var(--color-coral)] drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.25, 1], scaleX: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Right-Center Lamp (Hidden on small) */}
          <motion.div 
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.6, duration: 1.2, stiffness: 90 }}
            className="flex flex-col items-center hidden sm:flex"
          >
            <div className="w-0.5 h-16 bg-gradient-to-b from-[var(--color-coral)]/40 to-[var(--color-coral)]" />
            <svg width="24" height="24" viewBox="0 0 100 100" className="text-[var(--color-coral)] drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.2, 1], scaleX: [1, 1.15, 1] }} 
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>

          {/* Right Lamp */}
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.3, duration: 1.2, stiffness: 100 }}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-12 bg-gradient-to-b from-[var(--color-coral)]/60 to-[var(--color-coral)]" />
            <svg width="28" height="28" viewBox="0 0 100 100" className="text-[var(--color-coral)] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              <path fill="currentColor" d="M50 15 C52 35 75 50 75 70 A25 25 0 0 1 25 70 C25 50 48 35 50 15 Z" />
              <circle cx="50" cy="70" r="10" fill="#E25822" />
              <motion.path 
                animate={{ scaleY: [1, 1.35, 0.95, 1.2, 1], scaleX: [1, 1.1, 0.9, 1.15, 1] }} 
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                fill="#FFD700" 
                d="M50 42 C53 52 56 58 50 70 C44 58 47 52 50 42 Z" 
              />
            </svg>
          </motion.div>
        </div>

        {/* Success Card Wrapper */}
        <div className="relative z-10 max-w-lg mx-auto w-full px-4 py-2">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: 'spring', damping: 15 }}
            className="glass-card rounded-[2rem] p-5 md:p-6 relative overflow-hidden border border-[var(--color-coral)]/30 shadow-[0_0_35px_rgba(212,175,55,0.1)] animate-pulse-glow"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
              className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 border border-emerald-500/20 mx-auto"
            >
              <CheckCircle2 size={24} className="text-emerald-500" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="text-xl md:text-2xl font-bold font-display mb-1 text-gradient-coral text-glow"
            >
              Thank You for Using NIKASH CRACKERS! 🪔
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="text-xs md:text-sm font-medium text-[var(--text)]/80 mb-4"
            >
              We will contact you soon to finalize shipment details.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }} 
              className="bg-[var(--surface-high)] border border-[var(--border)] rounded-xl p-3.5 w-full mb-4 text-center"
            >
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Order Reference</div>
              <div className="text-xl font-bold text-[var(--color-coral)] font-display mb-1 tracking-wide">{orderResult.order_number}</div>
              <div className="text-xs text-[var(--text-muted)]">Net Payable: <span className="font-bold text-[var(--text)]">₹{orderResult.total_amount?.toLocaleString('en-IN')}</span></div>
            </motion.div>

            {/* Dynamic Status Banners */}
            <div className="grid gap-2 w-full mb-4">
              
              {/* Receipt Status Banner */}
              {receiptStatus === 'generating' && (
                <div className="flex items-center justify-center gap-2 p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-muted)] shadow-sm">
                  <div className="w-3.5 h-3.5 border-2 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin" />
                  Generating receipt PDF...
                </div>
              )}
              {receiptStatus === 'downloaded' && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 text-left flex gap-2.5 shadow-sm">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300">Receipt Downloaded!</strong>
                    Your PDF invoice has been automatically downloaded to your device.
                  </div>
                </div>
              )}
              {receiptStatus === 'failed' && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 text-left flex gap-2.5 shadow-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-450" />
                  <div>
                    <strong className="block text-rose-400">Receipt Download Failed</strong>
                    Could not auto-download the receipt. Please click "Download Receipt" below.
                  </div>
                </div>
              )}

              {/* Email Status Banner */}
              {emailStatus === 'sending' && (
                <div className="flex items-center justify-center gap-2 p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-muted)] shadow-sm">
                  <div className="w-3.5 h-3.5 border-2 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin" />
                  Emailing confirmation receipt...
                </div>
              )}
              {emailStatus === 'sent' && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 text-left flex gap-2.5 shadow-sm">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300">Receipt Emailed!</strong>
                    Invoice sent to <strong>{customerInfo.email || orderResult.customer_email}</strong>.
                  </div>
                </div>
              )}
              {emailStatus === 'skipped' && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 text-left flex gap-2.5 shadow-sm">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-450" />
                  <div>
                    <strong className="block text-amber-400">Email Status: Sandbox Mode</strong>
                    Confirmation email was skipped because Resend is not configured.
                  </div>
                </div>
              )}
              {emailStatus === 'failed' && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 text-left flex gap-2.5 shadow-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-450" />
                  <div>
                    <strong className="block text-rose-400">Email Delivery Interrupted</strong>
                    Could not send confirmation email to {customerInfo.email || orderResult.customer_email}.
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button 
                onClick={handleDownloadReceipt} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-full bg-[var(--surface-high)] border border-[var(--border)] text-[var(--text)] font-bold text-xs flex items-center justify-center gap-1.5 hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] transition-colors"
              >
                <Download size={14} /> Download Receipt
              </motion.button>

              <Link href="/products" className="block">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                >
                  Continue Shopping <ArrowRight size={14} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step < 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-28 h-28 bg-[var(--surface-high)] rounded-full flex items-center justify-center mb-6 text-[var(--color-coral)] border border-[var(--border)]">
          <PackageOpen size={56} />
        </motion.div>
        <h2 className="text-3xl font-bold font-display mb-4">Your Cart is Empty</h2>
        <p className="text-[var(--text-muted)] max-w-md mb-8">Explore our premium collection and add products to your cart!</p>
        <Link href="/products"><motion.button whileHover={{ scale: 1.05 }} className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold flex items-center gap-2 shadow-lg">Browse Products <ArrowRight size={16} /></motion.button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {['Review Cart', 'Your Details', 'Confirm Order'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400]' : 'bg-[var(--surface-high)] text-[var(--text-muted)] border border-[var(--border)]'}`}>
              {step > i + 1 ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step === i + 1 ? 'text-[var(--color-coral)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
            {i < 2 && <div className={`w-12 h-px ${step > i + 1 ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Cart Review */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--color-coral)]" />
              <h1 className="text-3xl font-bold font-display">Review Your Cart</h1>
            </div>
            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 rounded-full border border-[var(--border)] hover:border-[var(--color-coral)] text-xs text-[var(--text-muted)] hover:text-[var(--color-coral)] transition-colors flex items-center gap-2 w-fit bg-[var(--surface-high)]/50 backdrop-blur-md font-bold"
              >
                <span>Add More Products / Keep Shopping</span>
                <ArrowRight size={12} className="text-[var(--color-coral)]" />
              </motion.button>
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:flex-1 glass-card rounded-2xl overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] bg-[var(--surface-high)] font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-[0.15em]">
                <div className="col-span-5">Product</div><div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div><div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-center">Remove</div>
              </div>
              <div className="divide-y divide-[var(--border)]">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      exit={{ opacity: 0, x: -100, height: 0 }}
                      className="p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4"
                    >
                      {/* Left: Image & Details */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-[var(--surface-high)] overflow-hidden flex-shrink-0 border border-[var(--border)] flex items-center justify-center relative">
                          {item.product.image_url ? (
                            <Image src={item.product.image_url} alt={item.product.name_en} fill className="object-cover" sizes="56px" />
                          ) : (
                            <span className="text-lg opacity-30">🎇</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-[var(--color-coral)] font-bold uppercase tracking-[0.15em] block mb-0.5">
                            {item.product.category}
                          </span>
                          <h3 className="font-bold text-sm text-[var(--text)] truncate">
                            {item.product.name_en}
                          </h3>
                          {/* Price - Mobile Only */}
                          <div className="flex items-baseline gap-2 mt-1 md:hidden">
                            <span className="font-bold text-sm text-[var(--text)]">₹{item.product.price}</span>
                            <span className="text-[10px] text-[var(--text-muted)] line-through">₹{item.product.mrp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price, Qty, Total, Remove */}
                      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 border-t border-[var(--border)]/30 md:border-t-0 pt-3 md:pt-0">
                        {/* Price - Desktop Only */}
                        <div className="hidden md:block text-center w-20">
                          <span className="font-bold text-sm">₹{item.product.price}</span>
                          <div className="text-[10px] text-[var(--text-muted)] line-through">₹{item.product.mrp}</div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center bg-[var(--surface-high)] rounded-lg border border-[var(--border)] overflow-hidden h-8">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-7 flex justify-center items-center h-full hover:bg-[var(--surface-highest)] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <div className="w-8 text-center text-xs font-bold border-x border-[var(--border)] h-full flex items-center justify-center">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 flex justify-center items-center h-full hover:bg-[var(--surface-highest)] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Total Price & Delete Button */}
                        <div className="flex items-center gap-4 md:w-32 justify-end">
                          <div className="text-right">
                            <span className="font-bold text-lg text-[var(--color-coral)]">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="w-full lg:w-[380px] sticky top-28">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold font-display mb-5 border-b border-[var(--border)] pb-3 flex items-center gap-2"><ShoppingCart size={16} className="text-[var(--color-coral)]" /> Order Summary</h3>
                {(() => {
                  const grossAmount = items.reduce((sum, item) => sum + (item.product.mrp || item.product.price || 0) * item.quantity, 0);
                  const discountTotal = items.reduce((sum, item) => sum + ((item.product.mrp || item.product.price || 0) - (item.product.price || 0)) * item.quantity, 0);
                  const subtotal = getTotal();
                  const packingCharges = Math.round(subtotal * 0.03);
                  const totalAmount = subtotal + packingCharges;
                  const savingsPercent = grossAmount > 0 ? Math.round((discountTotal / grossAmount) * 100) : 0;

                  return (
                    <>
                      <div className="space-y-3 mb-5 text-sm">
                        <div className="flex justify-between"><span className="text-[var(--text-muted)]">Gross MRP Total</span><span className="font-bold">₹{grossAmount.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Savings Highlight</span>
                          <span>You Save ₹{discountTotal.toLocaleString('en-IN')} ({savingsPercent}%)</span>
                        </div>
                        <div className="flex justify-between text-[var(--text-muted)] border-t border-[var(--border)]/30 pt-2"><span>Net Product Subtotal</span><span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-[var(--text-muted)]"><span>Packing Charges (3%)</span><span className="font-bold">₹{packingCharges.toLocaleString('en-IN')}</span></div>
                      </div>
                      <div className="flex justify-between items-end border-t border-[var(--border)] pt-4 mb-6">
                        <span className="font-bold">Net Payable Amount</span><span className="text-2xl font-bold text-[#F7B733]">₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  );
                })()}

                {getTotal() < minOrderValue && (
                  <div className="flex items-start gap-2.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-5 text-xs text-left">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Minimum Order Required</span>
                      <p className="mt-0.5 text-rose-300/80">Minimum order amount is ₹{minOrderValue.toLocaleString('en-IN')}. Please add ₹{(minOrderValue - getTotal()).toLocaleString('en-IN')} more to proceed.</p>
                    </div>
                  </div>
                )}

                <motion.button 
                  onClick={() => getTotal() >= minOrderValue && goToStep(2)} 
                  disabled={getTotal() < minOrderValue}
                  whileHover={getTotal() >= minOrderValue ? { scale: 1.02 } : {}} 
                  whileTap={getTotal() >= minOrderValue ? { scale: 0.98 } : {}}
                  className="w-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold rounded-xl py-3.5 text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3">
                  Proceed to Details <ArrowRight size={16} />
                </motion.button>

                <Link href="/products" className="block text-center text-xs text-[var(--text-muted)] hover:text-[var(--color-coral)] transition-colors mt-2 font-bold py-1 border-t border-[var(--border)]/20 pt-3">
                  ← Add More Products
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Customer Details */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
          <button onClick={() => goToStep(1)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-coral)] mb-6"><ArrowLeft size={16} /> Back to Cart</button>
          <h1 className="text-3xl font-bold font-display mb-8">Your Details</h1>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (customerInfo.phone.length !== 10) {
              setSubmitError('Mobile Number must be exactly 10 digits.');
              return;
            }
            if (customerInfo.pincode.length !== 6) {
              setSubmitError('Pincode must be exactly 6 digits.');
              return;
            }
            if (!customerInfo.email) {
              setSubmitError('Email Address is required.');
              return;
            }
            setSubmitError(null);
            goToStep(3); 
          }} className="glass-card rounded-2xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Full Name *</label>
                <input required value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all" placeholder="Your Full Name" /></div>
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Mobile Number *</label>
                <input required type="tel" pattern="[0-9]{10}" maxLength={10} value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all" placeholder="10-digit Mobile Number" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Email Address *</label>
                <input required type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all" placeholder="you@email.com" /></div>
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">State *</label>
                <select required value={customerInfo.state} onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Select State</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Puducherry">Puducherry</option>
                </select></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">District *</label>
                <input required value={customerInfo.district} onChange={(e) => setCustomerInfo({...customerInfo, district: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all" placeholder="e.g. Theni, Madurai" /></div>
              <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">City / Town *</label>
                <input required value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all" placeholder="Your City" /></div>
            </div>
            <div><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Full Delivery Address *</label>
              <textarea required rows={3} value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all resize-none" placeholder="House No, Street, Area, Landmark" /></div>
            <div className="w-1/3"><label className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Pincode *</label>
              <input required type="tel" pattern="[0-9]{6}" maxLength={6} value={customerInfo.pincode} onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})} className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--color-coral)] focus:outline-none transition-all" placeholder="6-digit Pincode" /></div>
            
            {submitError && (
              <div className="flex items-start gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-left">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm">Validation Error</span>
                  <p className="text-xs text-rose-300/80 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <motion.button type="submit" whileHover={{ scale: 1.02 }} className="w-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold rounded-xl py-3.5 text-sm shadow-lg flex items-center justify-center gap-2">
              Review Order <ArrowRight size={16} />
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
          <button onClick={() => goToStep(2)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-coral)] mb-6"><ArrowLeft size={16} /> Edit Details</button>
          <h1 className="text-3xl font-bold font-display mb-8">Confirm Your Order</h1>
          
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Customer Details */}
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-coral)] uppercase tracking-wider mb-4">Customer Details</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2"><User size={14} className="text-[var(--color-coral)]" /> <span className="font-bold">{customerInfo.name}</span></div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-[var(--color-coral)]" /> {customerInfo.phone}</div>
                    {customerInfo.email && <div className="flex items-center gap-2"><Mail size={14} className="text-[var(--color-coral)]" /> {customerInfo.email}</div>}
                    <div className="flex items-start gap-2 text-[var(--text-muted)] text-xs pt-1">
                      <MapPin size={14} className="text-[var(--color-coral)] shrink-0 mt-0.5" />
                      <span>{[customerInfo.address, customerInfo.city, customerInfo.pincode].filter(Boolean).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Place of Supply & Transport */}
                <div className="border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-6">
                  <h3 className="font-bold text-sm text-[var(--color-coral)] uppercase tracking-wider mb-4">Place of Supply & Transport</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">State:</span><span className="font-bold">{customerInfo.state}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">District:</span><span className="font-bold">{customerInfo.district}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Destination:</span><span>{customerInfo.city}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Postal Code:</span><span>{customerInfo.pincode}</span></div>
                    <div className="pt-2 border-t border-[var(--border)] mt-2 text-xs text-[var(--color-coral)] font-bold">
                      📦 Pickup: Nearest Transport Office Hub
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm text-[var(--color-coral)] uppercase tracking-wider mb-4">Order Items ({items.length})</h3>
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-[var(--border)]/50 last:border-0 text-sm">
                  <span>{item.quantity}x {item.product.name_en}</span>
                  <span className="font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Gross Total</span><span>₹{(getTotal() + getSavings()).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-emerald-500"><span>Discount</span><span>-₹{getSavings().toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between pt-1 border-t border-[var(--border)]/30"><span className="text-[var(--text-muted)]">Total Value (Net)</span><span className="font-bold">₹{getTotal().toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Packing Charges (3%)</span><span className="font-bold">₹{Math.round(getTotal() * 0.03).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--border)]"><span>Net Payable</span><span className="text-[var(--color-coral)]">₹{(getTotal() + Math.round(getTotal() * 0.03)).toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border-[var(--color-coral)]/30 bg-[var(--color-coral)]/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[var(--color-coral)] shrink-0 mt-0.5" />
                <div><p className="font-bold text-sm text-[var(--text)] mb-1">Please verify all details before confirming</p>
                  <p className="text-xs text-[var(--text-muted)]">Once confirmed, a PDF order receipt will be auto-downloaded.{customerInfo.email ? ` An email confirmation will be sent to ${customerInfo.email}.` : ''}</p></div>
              </div>
            </div>

            {submitError && (
              <div className="flex items-start gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-left">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-450" />
                <div>
                  <span className="font-bold text-sm">Order Submission Failed</span>
                  <p className="text-xs text-rose-300/80 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <motion.button onClick={handlePlaceOrder} disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold rounded-xl py-4 text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50">
              {isSubmitting ? 'Placing Order...' : <><CheckCircle2 size={20} /> Confirm & Place Order</>}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}


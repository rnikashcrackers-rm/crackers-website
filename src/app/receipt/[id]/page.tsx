'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle, ArrowLeft, Sparkles, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatOrderDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReceiptDownloadPage({ params }: PageProps) {
  const { id } = React.use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error('Order not found or invalid link.');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleDownloadReceipt = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
      
      const orderItems = (order.items || []).map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        mrp: i.mrp,
        category: i.category || 'Fireworks'
      }));

      const itemsTotal = orderItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0);
      const diff = (order.total_amount || 0) - itemsTotal;
      const calculatedPacking = Math.round(itemsTotal * 0.03);
      const packingCharges = (diff >= calculatedPacking - 2 && diff <= calculatedPacking + 2) ? diff : 0;

      const doc = await generateReceipt({
        orderNumber: order.order_number,
        date: formatOrderDate(order.created_at),
        customerName: order.customer_name,
        customerEmail: order.customer_email || '',
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address || '',
        customerCity: order.customer_city || '',
        customerPincode: order.customer_pincode || '',
        customerState: order.customer_state || '',
        customerDistrict: order.customer_district || '',
        items: orderItems,
        subtotal: order.subtotal || (itemsTotal + (order.discount_total || 0)),
        discountTotal: order.discount_total || 0,
        totalAmount: order.total_amount,
        packingCharges: packingCharges,
      });

      downloadReceipt(doc, order.order_number);
    } catch (err) {
      console.error('Error generating PDF receipt:', err);
      alert('Could not generate PDF. Please try again or contact support.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[var(--color-coral)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--text-muted)] font-medium">Retrieving order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 text-rose-500 border border-rose-500/20">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold font-display mb-3">Unable to Load Receipt</h2>
        <p className="text-[var(--text-muted)] mb-8 text-sm">{error || 'This receipt link seems to be invalid or has expired.'}</p>
        <Link href="/">
          <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-3 rounded-full bg-[var(--surface-high)] border border-[var(--border)] text-[var(--text)] text-sm font-bold flex items-center gap-2">
            <ArrowLeft size={16} /> Go to Homepage
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--color-coral)]/10 text-[var(--color-coral)] border border-[var(--color-coral)]/20 mb-4">
            <Sparkles size={24} />
          </motion.div>
          <h1 className="text-3xl font-bold font-display text-[var(--text)]">NIKASH CRACKERS</h1>
          <p className="text-xs text-[var(--color-coral)] font-bold uppercase tracking-widest mt-1">Sivakasi Premium Fireworks</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card rounded-3xl p-8 border border-[var(--border)] shadow-2xl relative overflow-hidden bg-[var(--surface)]">
          {/* Confirmed Stamp in background */}
          <div className="absolute top-6 right-6 border-2 border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[10px] font-black tracking-widest uppercase rounded px-3 py-1 rotate-12 select-none">
            Confirmed
          </div>

          <h2 className="text-xl font-bold font-display mb-6 border-b border-[var(--border)] pb-4 flex items-center gap-2 text-[var(--text)]">
            <FileText size={18} className="text-[var(--color-coral)]" /> Order Confirmed
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Order Reference</span>
              <span className="text-lg font-bold font-display text-[var(--color-coral)]">{order.order_number}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Date Placed</span>
              <span className="text-sm font-medium text-[var(--text)]">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="bg-[var(--surface-high)] border border-[var(--border)] rounded-2xl p-5 mb-6 text-sm">
            <h3 className="font-bold text-[var(--color-coral)] mb-3 text-xs uppercase tracking-wider">Customer Information</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Name:</span><span className="font-bold text-[var(--text)]">{order.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Phone:</span><span className="text-[var(--text)]">{order.customer_phone}</span></div>
              {order.customer_email && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Email:</span><span className="text-[var(--text)]">{order.customer_email}</span></div>}
              <div className="flex justify-between pt-1 border-t border-[var(--border)]/40 mt-1"><span className="text-[var(--text-muted)]">Destination:</span><span className="text-[var(--text)]">{order.customer_city}, {order.customer_state}</span></div>
            </div>
          </div>

          {/* Short summary of products */}
          <div className="border border-[var(--border)] rounded-2xl overflow-hidden mb-6">
            <div className="bg-[var(--surface-high)] px-4 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
              Order Items Summary
            </div>
            <div className="divide-y divide-[var(--border)] max-h-40 overflow-y-auto px-4">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between py-2 text-xs">
                  <span className="text-[var(--text)] font-medium">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-[var(--text)]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="bg-[var(--surface-high)] px-4 py-3 flex justify-between items-center border-t border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--text)]">Net Payable Total:</span>
              <span className="text-base font-bold text-[var(--color-coral)] font-display">₹{order.total_amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-8 text-xs">
            <h3 className="font-bold text-[var(--color-coral)] mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              🏦 Bank Transfer Payment Instructions
            </h3>
            <div className="space-y-2 text-[var(--text-muted)]">
              <p>Please complete your bank transfer payment to confirm and dispatch your fireworks order:</p>
              <div className="bg-black/30 p-3.5 rounded-xl space-y-1 font-mono text-[11px] text-[var(--text)]">
                <div className="flex justify-between"><span>Account Name:</span><span className="font-bold text-amber-300">Muthuganesa pandian C</span></div>
                <div className="flex justify-between"><span>Bank Name:</span><span className="font-bold">City Union Bank</span></div>
                <div className="flex justify-between"><span>Account Number:</span><span className="font-bold text-amber-300">500101012011879</span></div>
                <div className="flex justify-between"><span>IFSC Code:</span><span className="font-bold text-amber-300">CIUB0000162</span></div>
                <div className="flex justify-between"><span>GPay / PhonePe:</span><span className="font-bold text-amber-300">7867955841</span></div>
              </div>
              <p className="text-[10px] text-amber-400/80 italic mt-2">
                *After payment, please send a screenshot of the transaction along with your Order Reference ({order.order_number}) to WhatsApp support at +91 78679 55841.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              onClick={handleDownloadReceipt}
              disabled={downloading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-black rounded-xl py-4 text-sm shadow-xl flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1a1400] border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={16} /> Download Official PDF Receipt
                </>
              )}
            </motion.button>
            
            <a 
              href={`https://wa.me/917867955841?text=Payment%20Screenshot%20for%20Order%20${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold rounded-xl py-4 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Send Payment Screenshot <ExternalLink size={14} />
              </motion.button>
            </a>
          </div>
        </motion.div>
        
        <div className="text-center mt-8 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Nikash Crackers, Sivakasi. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

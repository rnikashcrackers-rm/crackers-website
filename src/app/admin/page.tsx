'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/store/adminStore';
import { 
  Lock, LayoutDashboard, ShoppingCart, Package, Mail, MessageCircle, 
  BarChart3, LogOut, Search, RefreshCw, Trash2, CheckCircle2, Clock, 
  Truck, XCircle, Users, DollarSign, TrendingUp, Upload, Database, 
  Zap, Gift, FileText, Download, Send, ChevronRight, X, Eye, 
  SlidersHorizontal, Calendar, MapPin, User, ArrowRight, Settings, 
  CreditCard, Tags, Sliders, Cpu, LineChart, Plus, Edit, Sparkles, Check,
  Printer
} from 'lucide-react';
import Image from 'next/image';
import { adminAuthHeaders } from '@/lib/admin-auth';
import { formatOrderDate } from '@/lib/utils';

// --- CUSTOM MODAL CONFIRM DIALOG ---
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ isOpen, title, message, confirmLabel, cancelLabel = 'Cancel', isDanger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  // --- SUCCESS TOAST COMPONENT ---
  // (Placed above ConfirmDialog for reference but rendered separately)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-0" 
            onClick={onCancel} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-3xl p-8 shadow-2xl my-auto"
          >
            <div className="text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${isDanger ? 'bg-rose-500/10 text-rose-400' : 'bg-[#FF8A6B]/10 text-[#8C1D1D]'}`}>
                {isDanger ? <Trash2 size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <h3 className="text-xl font-bold font-display text-[#2D241E] mb-2">{title}</h3>
              <p className="text-sm text-[#5C544C] mb-6 leading-relaxed">{message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={onCancel} 
                  className="flex-1 py-3 rounded-xl border border-[#E8E2D8] text-[#2D241E] font-bold text-sm hover:bg-[#FF8A6B]/5 transition-colors"
                >
                  {cancelLabel}
                </button>
                <button 
                  onClick={onConfirm} 
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all ${isDanger ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A]'}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- LOGIN GATE ---
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/auth', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ password }) 
      });
      const data = await res.json();
      if (res.ok) { 
        onLogin(data.token); 
      } else { 
        setError(data.error || 'Invalid password'); 
      }
    } catch (err: any) { 
      setError(`Connection failed: ${err?.message || err}`); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-premium rounded-3xl p-10 text-center relative overflow-hidden shadow-xl border border-white/40 bg-white/30 backdrop-blur-md">
          
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-6 shadow-md border border-[#E8E2D8]/40 bg-white flex items-center justify-center text-2xl select-none">
             🎆
          </div>
          <h1 className="text-3xl font-black font-display text-[#2D241E] mb-2 tracking-tight">Admin Console</h1>
          <p className="text-[#5C544C] text-sm font-semibold mb-8">Authorize to enter the command center</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter admin password" 
                required
                className="w-full bg-white/70 border border-[#E8E2D8] rounded-xl px-4 py-3.5 text-center text-sm text-[#2D241E] placeholder-[#5C544C]/40 focus:border-[#FF8A6B] focus:outline-none transition-colors shadow-sm" 
              />
            </div>
            
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm font-bold">
                {error}
              </motion.p>
            )}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-[#2D241E] font-extrabold text-sm uppercase tracking-wider hover:shadow-[0_8px_24px_rgba(255,107,74,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying Credentials...' : 'Access Command Center'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// --- STAT CARD ---
function StatCard({ icon: Icon, label, value, color, change }: { icon: any; label: string; value: string | number; color: string; change?: string }) {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF8A6B]/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold font-display text-[#2D241E] mb-1">{value}</div>
      <div className="text-xs text-[#5C544C] font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

// --- STATUS BADGE ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[status] || 'bg-[#2A2A24] text-[#5C544C] border-[#E8E2D8]'}`}>
      {status}
    </span>
  );
}

// --- MAIN ADMIN COMMAND CENTER ---
// --- UTILITY: CSV Download ---
function downloadCSV(data: Record<string, any>[], columns: { key: string; label: string }[], filename: string) {
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key];
      const str = val === null || val === undefined ? '' : String(val);
      // Escape commas and quotes in CSV
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- UTILITY: Print Log ---
function printLog(title: string, headers: string[], rows: string[][]) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;
  const tableRows = rows.map(row =>
    `<tr>${row.map(cell => `<td style="border:1px solid #ddd;padding:6px 10px;font-size:11px;">${cell}</td>`).join('')}</tr>`
  ).join('');
  const html = `
    <!DOCTYPE html>
    <html><head><title>${title} — NIKASH CRACKERS</title>
    <style>
      body{font-family:Arial,sans-serif;margin:30px;color:#333;}
      .header{text-align:center;border-bottom:3px solid #FF8A6B;padding-bottom:15px;margin-bottom:25px;}
      .header h1{font-size:20px;margin:5px 0;color:#333;}
      .header p{font-size:11px;color:#888;margin:0;}
      .header .brand{font-size:14px;color:#FF8A6B;font-weight:bold;letter-spacing:2px;}
      table{width:100%;border-collapse:collapse;margin-top:10px;}
      th{border:1px solid #FF8A6B;padding:8px 10px;font-size:10px;text-transform:uppercase;letter-spacing:1px;background:#FFF5F2;color:#333;text-align:left;}
      td{border:1px solid #ddd;padding:6px 10px;font-size:11px;}
      tr:nth-child(even){background:#fafafa;}
      .footer{text-align:center;margin-top:30px;font-size:9px;color:#aaa;border-top:1px solid #eee;padding-top:10px;}
      @media print{body{margin:15mm;}.no-print{display:none;}}
    </style></head>
    <body>
      <div class="header">
        <div class="brand">✦ NIKASH CRACKERS ✦</div>
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-IN', { day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit' })}</p>
        <p>1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office, Vembakottai | ☎ +91 78679 55841</p>
      </div>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">This document is auto-generated from NIKASH CRACKERS Command Center. Confidential.</div>
      <script>window.onload=function(){window.print();}</script>
    </body></html>`;
  printWindow.document.write(html);
  printWindow.document.close();
}

// --- SUCCESS TOAST OVERLAY ---
function AdminSuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-[#2D241E] shadow-[0_20px_60px_rgba(16,185,129,0.4)] border border-emerald-400/30 backdrop-blur-xl min-w-[300px] max-w-[90vw]"
    >
      {/* Animated checkmark */}
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" className="animate-check-draw" />
        </svg>
      </div>
      <span className="flex-1 font-bold text-sm leading-tight">{message}</span>
      <button onClick={onClose} className="text-[#2D241E]/60 hover:text-[#2D241E] p-1 transition-colors">
        <X size={14} />
      </button>
      {/* Confetti dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          animate={{
            opacity: 0,
            y: -30 - Math.random() * 30,
            x: (Math.random() - 0.5) * 60,
            scale: 0.3,
          }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
          className="absolute top-2 left-1/2"
          style={{ background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][i] }}
          />
      ))}
    </motion.div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, login, logout, activeTab, setActiveTab, checkSession } = useAdminStore();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Show success toast helper
  const showSuccess = useCallback((msg: string) => {
    setSuccessMessage(msg);
  }, []);

  // Scroll to top when changing tabs
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setInspectedOrder(null);
    // Scroll main content to top
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Also scroll window for mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);
  
  const adminFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = {
      ...adminAuthHeaders(),
      ...(init?.headers || {}),
    };
    return fetch(input, { ...init, headers });
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  
  // Settings & Bank Account lists
  const [settings, setSettings] = useState<any>({
    global_discount: '60',
    min_order_value: '2000',
    company_name: 'NIKASH CRACKERS',
    company_address: '1/406, SIVAKASI -VEMBAKOTAI MAIN ROAD, Opp to EB OFFICE,VEMBAKOTTAI.',
    mobile_number_1: '7867955841',
    mobile_number_2: '7867955841',
    whatsapp_number: '7867955841',
    email_address: 'rnikashcrackers@gmail.com',
    marquee: '',
    whatsapp_provider: 'none',
    whatsapp_business_phone_number_id: '',
    whatsapp_business_access_token: '',
    whatsapp_ultramsg_instance_id: '',
    whatsapp_ultramsg_token: '',
    whatsapp_template_name: 'order_status_update',
    whatsapp_msg_pending: '',
    whatsapp_msg_confirmed: '',
    whatsapp_msg_processing: '',
    whatsapp_msg_shipped: '',
    whatsapp_msg_delivered: '',
    whatsapp_msg_cancelled: '',
  });
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  
  // Inspected Order
  const [inspectedOrder, setInspectedOrder] = useState<any | null>(null);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  
  // WhatsApp & Email Notifications states
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [customMessageText, setCustomMessageText] = useState('');
  const [sendingNotificationId, setSendingNotificationId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Function to build/preview the message text based on the status template and parameters
  const getInterpolatedMessage = (statusStr: string, trackingStr: string, orderObj: any) => {
    if (!orderObj) return '';
    let template = '';
    
    switch (statusStr) {
      case 'pending':
        template = settings.whatsapp_msg_pending || 'Hello {{customer_name}}, your order {{order_number}} is received and is pending verification. We will contact you shortly to confirm!';
        break;
      case 'confirmed':
        template = settings.whatsapp_msg_confirmed || 'Hello {{customer_name}}, your order {{order_number}} is confirmed! We are packaging your crackers now.';
        break;
      case 'processing':
        template = settings.whatsapp_msg_processing || 'Hello {{customer_name}}, your order {{order_number}} is being processed at our Sivakasi factory.';
        break;
      case 'shipped':
        template = settings.whatsapp_msg_shipped || 'Hello {{customer_name}}, your order {{order_number}} has been shipped! Transport tracking details: {{tracking_info}}';
        break;
      case 'delivered':
        template = settings.whatsapp_msg_delivered || 'Hello {{customer_name}}, your order {{order_number}} has been successfully delivered. Happy and safe celebrating! 🎆';
        break;
      case 'cancelled':
        template = settings.whatsapp_msg_cancelled || 'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you have questions.';
        break;
      default:
        template = `Hello {{customer_name}}, your order {{order_number}} is currently: ${statusStr.toUpperCase()}.`;
    }

    return template
      .replace(/\{\{customer_name\}\}/g, orderObj.customer_name || 'Customer')
      .replace(/\{\{order_number\}\}/g, orderObj.order_number || '')
      .replace(/\{\{tracking_info\}\}/g, trackingStr || 'N/A')
      .replace(/\{\{status\}\}/g, statusStr);
  };

  // Reset/update message when order status changes
  useEffect(() => {
    if (inspectedOrder) {
      const msg = getInterpolatedMessage(inspectedOrder.status, trackingInfo, inspectedOrder);
      setCustomMessageText(msg);
    } else {
      setTrackingInfo('');
      setCustomMessageText('');
      setNotificationStatus(null);
    }
  }, [inspectedOrder?.id, inspectedOrder?.status, trackingInfo]);
  const [mounted, setMounted] = useState(false);
  
  // Search and Filter states
  const [orderQuery, setOrderQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Custom dialog state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDanger?: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    action: () => {},
  });

  // Excel File State
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [seedStatus, setSeedStatus] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedComboStatus, setSeedComboStatus] = useState('');
  const [seedingCombos, setSeedingCombos] = useState(false);

  // CRUD Forms States
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  
  const [comboFormOpen, setComboFormOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState<any | null>(null);

  const [bankFormOpen, setBankFormOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<any | null>(null);

  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any | null>(null);

  const [sliderFormOpen, setSliderFormOpen] = useState(false);
  const [currentSlider, setCurrentSlider] = useState<any | null>(null);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings Save loading state
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');

  useEffect(() => { 
    setMounted(true); 
    checkSession(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [o, p, e, m, c, t, s, b, cats, slds] = await Promise.all([
        adminFetch('/api/orders').then(r => r.json()).catch(() => []),
        adminFetch('/api/products?admin=true&limit=500').then(r => r.json()).catch(() => ({ products: [] })),
        adminFetch('/api/enquiries').then(r => r.json()).catch(() => []),
        adminFetch('/api/contact').then(r => r.json()).catch(() => []),
        adminFetch('/api/combos').then(r => r.json()).catch(() => []),
        adminFetch('/api/admin/tracking').then(r => r.json()).catch(() => ({ error_logs: [], analytics_events: [] })),
        adminFetch('/api/settings?admin=true').then(r => r.json()).catch(() => ({})),
        adminFetch('/api/bank-accounts').then(r => r.json()).catch(() => []),
        adminFetch('/api/categories?admin=true').then(r => r.json()).catch(() => []),
        adminFetch('/api/sliders').then(r => r.json()).catch(() => []),
      ]);
      setOrders(Array.isArray(o) ? o : []);
      setProducts(Array.isArray(p) ? p : (p.products || []));
      setEnquiries(Array.isArray(e) ? e : []);
      setMessages(Array.isArray(m) ? m : []);
      setCombos(Array.isArray(c) ? c : []);
      setErrorLogs(t.error_logs || []);
      setAnalyticsEvents(t.analytics_events || []);
      if (s && Object.keys(s).length > 0) setSettings(s);
      setBankAccounts(Array.isArray(b) ? b : []);
      setCategories(Array.isArray(cats) ? cats : []);
      setSliders(Array.isArray(slds) ? slds : []);
    } catch (err) { 
      console.error(err); 
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (isAuthenticated) fetchData(); 
  }, [isAuthenticated]);

  // Sync inspected order when list refreshes
  useEffect(() => {
    if (inspectedOrder && orders.length > 0) {
      const updated = orders.find(o => o.id === inspectedOrder.id);
      if (updated) setInspectedOrder(updated);
    }
  }, [orders, inspectedOrder]);

  const updateOrderStatus = async (id: string, status: string, trackingStr?: string) => {
    // Optimistically update orders in UI instantly
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    
    try {
      const res = await adminFetch(`/api/orders/${id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          status,
          trackingInfo: trackingStr || undefined
        }) 
      });
      if (res.ok) {
        showSuccess(`✅ Order status updated to ${status.toUpperCase()}!`);
        // Fetch only updated orders to synchronize state quickly without full reload
        const updatedOrders = await adminFetch('/api/orders').then(r => r.json()).catch(() => null);
        if (updatedOrders) {
          setOrders(updatedOrders);
        }
      } else {
        // Revert to full reload if patch failed
        fetchData();
      }
    } catch (err) { 
      console.error(err); 
      fetchData();
    }
  };

  const handleSendStatusNotification = async (orderObj: any) => {
    if (!orderObj) return;
    setSendingNotificationId(orderObj.id);
    setNotificationStatus('Sending notifications...');
    try {
      const res = await adminFetch(`/api/orders/${orderObj.id}/notify-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: orderObj.status,
          trackingInfo,
          sendWhatsApp: notifyWhatsApp,
          sendEmail: notifyEmail,
          customMessage: customMessageText
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        let msg = '✅ Notification sent successfully!';
        const parts: string[] = [];
        if (data.whatsapp?.error) parts.push(`WhatsApp: ${data.whatsapp.error}`);
        if (data.email?.error) parts.push(`Email: ${data.email.error}`);
        if (parts.length > 0) {
          msg += ' (' + parts.join(', ') + ')';
        }
        setNotificationStatus(msg);
      } else {
        setNotificationStatus(`❌ Failed: ${data.error || 'Notification dispatch failed'}`);
      }
    } catch (err: any) {
      console.error(err);
      setNotificationStatus(`❌ Error: ${err.message || 'Connection failed'}`);
    }
    setSendingNotificationId(null);
  };

  const seedProducts = async () => {
    setSeeding(true); 
    setSeedStatus('Seeding all products from JSON price list into Database...');
    try {
      const res = await adminFetch('/api/admin/seed-products', { method: 'POST' });
      const data = await res.json();
      if (res.ok) { 
        setSeedStatus(`✅ Successfully seeded ${data.totalInserted} products!`); 
        showSuccess(`🎉 Seeded ${data.totalInserted} products into database!`);
        fetchData(); 
      } else { 
        setSeedStatus(`❌ Failed: ${data.error}`); 
      }
    } catch { 
      setSeedStatus('❌ Database seed operation failed'); 
    }
    setSeeding(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Product?',
      message: `Are you sure you want to delete "${name}"? This action is permanent.`,
      confirmLabel: 'Delete Product',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await adminFetch(`/api/products/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  const handleBulkDeleteProducts = () => {
    if (selectedProductIds.length === 0) return;
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Selected Products?',
      message: `Are you sure you want to delete the ${selectedProductIds.length} selected products? This action is permanent and cannot be undone.`,
      confirmLabel: 'Delete Selected',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await adminFetch(`/api/products?ids=${selectedProductIds.join(',')}`, { method: 'DELETE' });
          if (res.ok) {
            setSelectedProductIds([]);
            fetchData();
          } else {
            const data = await res.json().catch(() => ({}));
            alert(`Failed to delete products: ${data.error || 'Unknown error'}`);
          }
        } catch (err: any) {
          console.error(err);
          alert('Failed to delete products.');
        }
      }
    });
  };

  const handleDeleteOrder = (id: string, code: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Order Record?',
      message: `Are you sure you want to delete order "${code}"? This will erase it from database permanently.`,
      confirmLabel: 'Delete Record',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          // DELETE endpoints for orders
          const res = await adminFetch(`/api/orders/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setInspectedOrder(null);
            fetchData();
          } else {
            const data = await res.json().catch(() => ({}));
            alert(`Failed to delete order: ${data.error || res.statusText || 'Unknown error'}`);
          }
        } catch (err: any) { 
          console.error(err);
          alert(`Failed to delete order: ${err.message || String(err)}`);
        }
      }
    });
  };

  const seedCombos = async () => {
    setSeedingCombos(true); 
    setSeedComboStatus('Seeding default package combos into Database...');
    try {
      const res = await adminFetch('/api/admin/seed-combos', { method: 'POST' });
      const data = await res.json();
      if (res.ok) { 
        setSeedComboStatus(`✅ Successfully seeded ${data.totalInserted} combo packs!`); 
        showSuccess(`🎉 Seeded ${data.totalInserted} combo packs!`);
        fetchData(); 
      } else { 
        setSeedComboStatus(`❌ Failed: ${data.error}`); 
      }
    } catch { 
      setSeedComboStatus('❌ Combo seed operation failed'); 
    }
    setSeedingCombos(false);
  };

  const handleDeleteCombo = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Combo Pack?',
      message: `Are you sure you want to delete the "${name}" combo? This action is permanent.`,
      confirmLabel: 'Delete Combo',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await adminFetch(`/api/combos/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  const handleDeleteMessage = (id: string, senderName: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Contact Message?',
      message: `Are you sure you want to delete the message from "${senderName}"? This action is permanent.`,
      confirmLabel: 'Delete Message',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await adminFetch(`/api/contact?id=${id}`, { method: 'DELETE' });
          if (res.ok) {
            fetchData();
          } else {
            const data = await res.json().catch(() => ({}));
            alert(`Failed to delete message: ${data.error || res.statusText || 'Unknown error'}`);
          }
        } catch (err: any) { 
          console.error(err);
          alert(`Failed to delete message: ${err.message || String(err)}`);
        }
      }
    });
  };

  const handleDeleteAllMessages = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete All Messages?',
      message: 'Are you sure you want to delete ALL contact messages in your inbox? This action is permanent.',
      confirmLabel: 'Delete All',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await adminFetch('/api/contact', { method: 'DELETE' });
          if (res.ok) {
            fetchData();
          } else {
            const data = await res.json().catch(() => ({}));
            alert(`Failed to clear inbox: ${data.error || res.statusText || 'Unknown error'}`);
          }
        } catch (err: any) { 
          console.error(err);
          alert(`Failed to clear inbox: ${err.message || String(err)}`);
        }
      }
    });
  };

  const handleDeleteErrorLog = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/tracking?type=errors&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to delete log: ${data.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err: any) { 
      console.error(err);
      alert(`Failed to delete log: ${err.message || String(err)}`);
    }
  };

  const handleDeleteAllErrorLogs = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear All Error Logs?',
      message: 'Are you sure you want to delete ALL error logs? This action is permanent.',
      confirmLabel: 'Clear All',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await adminFetch('/api/admin/tracking?type=errors', { method: 'DELETE' });
          if (res.ok) {
            fetchData();
          } else {
            const data = await res.json().catch(() => ({}));
            alert(`Failed to clear error logs: ${data.error || res.statusText || 'Unknown error'}`);
          }
        } catch (err: any) { 
          console.error(err);
          alert(`Failed to clear error logs: ${err.message || String(err)}`);
        }
      }
    });
  };

  const handleDeleteAllAnalyticsEvents = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear All Analytics Events?',
      message: 'Are you sure you want to delete ALL tracking events? This action is permanent.',
      confirmLabel: 'Clear All',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const res = await adminFetch('/api/admin/tracking?type=analytics', { method: 'DELETE' });
          if (res.ok) {
            fetchData();
          } else {
            const data = await res.json().catch(() => ({}));
            alert(`Failed to clear analytics events: ${data.error || res.statusText || 'Unknown error'}`);
          }
        } catch (err: any) { 
          console.error(err);
          alert(`Failed to clear analytics events: ${err.message || String(err)}`);
        }
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('Uploading spreadsheet data...');
    const fd = new FormData(); 
    fd.append('file', file);
    try {
      const res = await adminFetch('/api/admin/seed', { method: 'POST', body: fd });
      const data = await res.json();
      setUploadStatus(res.ok ? `🎉 Imported ${data.count} products successfully!` : data.error);
      if (res.ok) {
        setFile(null);
        fetchData();
      }
    } catch { 
      setUploadStatus('Spreadsheet upload failed'); 
    }
  };

  const handleManualReceiptDownload = async (order: any) => {
    try {
      const orderItems = Array.isArray(order.items) 
        ? order.items.map((i: any) => ({
            name: i.name || i.product_name || 'Fireworks Item',
            quantity: i.quantity,
            price: i.price,
            mrp: i.mrp || i.original_price || i.price,
            category: i.category || 'Fireworks',
          }))
        : [];
      
      const itemsTotal = orderItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0);
      const diff = (order.total_amount || 0) - itemsTotal;
      const calculatedPacking = Math.round(itemsTotal * 0.03);
      const packingCharges = (diff >= calculatedPacking - 2 && diff <= calculatedPacking + 2) ? diff : 0;

      const { generateReceipt, downloadReceipt } = await import('@/lib/pdf/receiptGenerator');
      const doc = await generateReceipt({
        orderNumber: order.order_number,
        date: formatOrderDate(order.created_at),
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        customerCity: order.customer_city,
        customerPincode: order.customer_pincode,
        customerState: order.customer_state || '',
        customerDistrict: order.customer_district || '',
        items: orderItems,
        subtotal: order.subtotal || (itemsTotal + (order.discount_total || 0)),
        discountTotal: order.discount_total || 0,
        totalAmount: order.total_amount,
        packingCharges: packingCharges,
      });
      downloadReceipt(doc, order.order_number);
    } catch (e) {
      console.error('Receipt generation error:', e);
    }
  };

  const handleResendReceiptEmail = async (order: any) => {
    setResendingEmailId(order.id);
    try {
      const orderItems = Array.isArray(order.items)
        ? order.items.map((i: any) => ({
            name: i.name || i.product_name || 'Fireworks Item',
            quantity: i.quantity,
            price: i.price,
            mrp: i.mrp || i.original_price || i.price,
          }))
        : [];

      const res = await adminFetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.customer_email,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          items: orderItems,
          totalAmount: order.total_amount,
          subtotal: order.subtotal || order.total_amount,
          discountTotal: order.discount_total || 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.skipped ? 'Mock email simulated (Resend key missing)' : 'Invoice email sent successfully!');
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error sending email');
    } finally {
      setResendingEmailId(null);
    }
  };

  // CRUD: Save settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsStatus('Saving settings...');
    try {
      const res = await adminFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsStatus('✅ Settings saved successfully!');
        showSuccess('✅ Settings saved successfully!');
        fetchData();
      } else {
        const d = await res.json();
        setSettingsStatus(`❌ Save failed: ${d.error}`);
      }
    } catch {
      setSettingsStatus('❌ Connection failed saving settings');
    }
    setSavingSettings(false);
  };

  // CRUD: Products Add / Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentProduct.id ? 'PATCH' : 'POST';
      const endpoint = currentProduct.id ? `/api/products/${currentProduct.id}` : '/api/products';
      const res = await adminFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct)
      });
      if (res.ok) {
        setProductFormOpen(false);
        setCurrentProduct(null);
        showSuccess(currentProduct.id ? '✅ Product updated successfully!' : '🎉 New product added to inventory!');
        fetchData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(`Failed to save product: ${d.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProductStock = async (product: any) => {
    try {
      const nextStock = !product.in_stock;
      
      // Update local state immediately for instant feedback
      setProducts((prev: any[]) => prev.map((p: any) => p.id === product.id ? { ...p, in_stock: nextStock } : p));
      
      const res = await adminFetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ in_stock: nextStock })
      });
      
      if (!res.ok) {
        // Revert local state on error
        setProducts((prev: any[]) => prev.map((p: any) => p.id === product.id ? { ...p, in_stock: product.in_stock } : p));
        alert('Failed to update stock status on server');
      }
    } catch (err) {
      console.error(err);
      // Revert local state on error
      setProducts((prev: any[]) => prev.map((p: any) => p.id === product.id ? { ...p, in_stock: product.in_stock } : p));
      alert('Network error updating stock status');
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (file: File, target: 'product' | 'combo' | 'slider') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await adminFetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (target === 'product') {
          setCurrentProduct((prev: any) => prev ? { ...prev, image_url: data.url } : prev);
        } else if (target === 'combo') {
          setCurrentCombo((prev: any) => prev ? { ...prev, image_url: data.url } : prev);
        } else if (target === 'slider') {
          setCurrentSlider((prev: any) => prev ? { ...prev, image_url: data.url } : prev);
        }
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Image upload failed. Please try again.');
    }
    setUploading(false);
  };

  // CRUD: Combos Add / Edit
  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentCombo.id ? 'PATCH' : 'POST';
      const endpoint = currentCombo.id ? `/api/combos/${currentCombo.id}` : '/api/combos';
      const res = await adminFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCombo)
      });
      if (res.ok) {
        setComboFormOpen(false);
        setCurrentCombo(null);
        showSuccess(currentCombo.id ? '✅ Combo pack updated!' : '🎉 New combo pack created!');
        fetchData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(`Failed to save combo: ${d.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CRUD: Bank Accounts Add / Edit / Delete
  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentBank.id ? 'PUT' : 'POST';
      const res = await adminFetch('/api/bank-accounts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBank)
      });
      if (res.ok) {
        setBankFormOpen(false);
        setCurrentBank(null);
        showSuccess(currentBank.id ? '✅ Bank account updated!' : '🎉 Bank account added!');
        fetchData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(`Failed to save bank details: ${d.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBank = (id: string, bankName: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Bank Account?',
      message: `Are you sure you want to delete bank details for "${bankName}"?`,
      confirmLabel: 'Delete Bank',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await adminFetch(`/api/bank-accounts?id=${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  // CRUD: Categories Add / Edit / Delete
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentCategory.isNew ? 'POST' : 'PUT';
      const res = await adminFetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCategory)
      });
      if (res.ok) {
        setCategoryFormOpen(false);
        setCurrentCategory(null);
        showSuccess(currentCategory.isNew ? '🎉 New category created!' : '✅ Category updated!');
        fetchData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(`Failed to save category: ${d.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = (id: string, label: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Category?',
      message: `Are you sure you want to delete the category "${label}"?`,
      confirmLabel: 'Delete Category',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await adminFetch(`/api/categories?id=${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  // CRUD: Sliders Add / Edit / Delete
  const handleSaveSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentSlider.id ? 'PUT' : 'POST';
      const res = await adminFetch('/api/sliders', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSlider)
      });
      if (res.ok) {
        setSliderFormOpen(false);
        showSuccess(currentSlider.id ? '✅ Banner updated!' : '🎉 Homepage banner added!');
        fetchData();
      } else {
        alert('Failed to save slider image');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlider = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Slider?',
      message: 'Are you sure you want to delete this homepage slider banner?',
      confirmLabel: 'Delete Banner',
      isDanger: true,
      action: async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await adminFetch(`/api/sliders?id=${id}`, { method: 'DELETE' });
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  if (!mounted) return <div className="min-h-screen bg-transparent" />;
  if (!isAuthenticated) return <AdminLogin onLogin={login} />;

  // Compiled Statistics
  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const confirmedOrders = orders.filter((o: any) => o.status === 'confirmed' || o.status === 'delivered').length;
  
  // Distilled Unique Customers Base
  const customerMap = new Map();
  orders.forEach((o: any) => {
    if (!o.customer_phone) return;
    const phone = o.customer_phone;
    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        name: o.customer_name,
        email: o.customer_email || 'N/A',
        phone: o.customer_phone,
        city: o.customer_city || 'N/A',
        ordersCount: 1,
        totalSpent: o.total_amount || 0,
      });
    } else {
      const existing = customerMap.get(phone);
      existing.ordersCount += 1;
      existing.totalSpent += (o.total_amount || 0);
    }
  });
  const customersList = Array.from(customerMap.values());

  const tabs = [
    { id: 'orders', label: 'Orders Log', icon: ShoppingCart },
    { id: 'products', label: 'Inventory Desk', icon: Package },
    { id: 'categories', label: 'Categories Desk', icon: Tags },
    { id: 'enquiries', label: 'Order Enquiries', icon: MessageCircle },
    { id: 'messages', label: 'Inbox', icon: Mail },
    { id: 'customers', label: 'Customer Base', icon: Users },
    { id: 'bank-accounts', label: 'Bank Accounts', icon: CreditCard },
    { id: 'sliders', label: 'Homepage Banners', icon: Sliders },
    { id: 'settings', label: 'Settings & Config', icon: Settings },
    { id: 'diagnostics', label: 'System Logs', icon: Database },
  ];

  // Filtering list items
  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(orderQuery.toLowerCase()) || 
    o.customer_name?.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.customer_phone?.toLowerCase().includes(orderQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    (p.name_en || p.product_name)?.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(productQuery.toLowerCase())
  );

  // AI Growth recommendation algorithm
  const generateAIRecommendation = () => {
    const advices = [];
    if (orders.length === 0 && enquiries.length === 0) {
      return ["⚠️ Low data stream. Promote your website on WhatsApp to receive customer cart orders & enquiries."];
    }
    
    // 1. Town demand density recommendations
    const towns: Record<string, number> = {};
    orders.forEach(o => {
      if (o.customer_city) {
        const t = o.customer_city.trim();
        const normalized = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
        towns[normalized] = (towns[normalized] || 0) + 1;
      }
    });
    enquiries.forEach(e => {
      if (e.customer_city) {
        const t = e.customer_city.trim();
        const normalized = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
        towns[normalized] = (towns[normalized] || 0) + 1;
      }
    });
    
    const topTown = Object.entries(towns).sort((a, b) => b[1] - a[1])[0];
    if (topTown) {
      const totalRequests = orders.length + enquiries.length;
      advices.push(`🔥 Town Demand Density: **${topTown[0]}** accounts for **${Math.round((topTown[1] / totalRequests) * 100)}%** of overall orders and enquiries activity. Target local promos here.`);
    }

    // 2. Conversion recommendations
    const totalRequests = orders.length + enquiries.length;
    const conversion = totalRequests > 0 ? Math.round((orders.length / totalRequests) * 100) : 0;
    if (conversion < 40) {
      advices.push(`📉 Conversion alert: Only **${conversion}%** of visitors check out. Try reducing your minimum order value from ₹${settings.min_order_value} to ₹1,500 to lower barriers.`);
    } else {
      advices.push(`📈 Healthy Conversion: Checkout conversion rate is at a strong **${conversion}%**.`);
    }

    // 3. Category recommendations
    const categoriesSales: Record<string, number> = {};
    orders.forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          const cat = item.category || 'general';
          categoriesSales[cat] = (categoriesSales[cat] || 0) + item.quantity;
        });
      }
    });
    const topCat = Object.entries(categoriesSales).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
      advices.push(`🎇 Category Driver: **${topCat[0].replace('-', ' ').toUpperCase()}** is your best-selling product category. Ensure you have high inventory stock.`);
    }

    // 4. Cart Value recommendation
    const averageOrderValue = Math.round(totalRevenue / orders.length);
    if (averageOrderValue < 4000) {
      advices.push(`💰 Average Order Value: ₹${averageOrderValue.toLocaleString('en-IN')}. Introduce premium curated Combo Giftboxes (e.g. ₹5,000 package) to encourage bulk orders.`);
    }

    return advices;
  };

  const aiGrowthAdvices = generateAIRecommendation();

  // Custom SVG Chart points calculation for total sales over time
  const getChartPoints = () => {
    if (orders.length === 0) return '0,100 100,100';
    const sorted = [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    let cumulative = 0;
    const dataPoints = sorted.map((o, index) => {
      cumulative += o.total_amount || 0;
      return {
        x: (index / (sorted.length - 1)) * 500,
        y: 150 - (cumulative / totalRevenue) * 120
      };
    });
    // Fallback if single order
    if (dataPoints.length === 1) {
      return `0,150 500,${dataPoints[0].y}`;
    }
    return dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  };

  return (
    <div className="min-h-screen bg-transparent text-[#2D241E] flex flex-col md:flex-row font-sans selection:bg-[var(--color-coral)] selection:text-black">
      
      {/* SIDEBAR — Horizontal on mobile, vertical on desktop */}
      <aside className="w-full md:w-64 bg-white/30 backdrop-blur-md border-b md:border-b-0 md:border-r border-[#E8E2D8] flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-[#E8E2D8] flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-[#FF8A6B]/30 relative bg-white shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Image src="/logo/logo.png" alt="NIKASH CRACKERS" width={40} height={40} priority className="object-cover w-full h-full dark:brightness-[0.9] dark:contrast-[1.1] transition-all duration-300" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-[#2D241E]">JJ COMMAND</h1>
            <p className="text-[9px] text-[#8C1D1D] font-bold tracking-widest uppercase">BI Console Hub</p>
          </div>
        </div>

        {/* Tab Navigation — horizontal scrollable on mobile */}
        <nav className="flex-1 p-2 md:p-4 md:space-y-1 overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-auto md:max-h-none scrollbar-thin">
          <div className="flex md:flex-col gap-1.5 md:gap-1 admin-mobile-tabs md:!overflow-visible">
            {tabs.map(t => (
              <button 
                key={t.id} 
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center justify-between px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap shrink-0 md:w-full ${
                  activeTab === t.id 
                    ? 'bg-gradient-to-r from-[var(--color-coral)]/10 to-[var(--color-coral-dark)]/5 text-[#8C1D1D] border border-[#FF8A6B]/20 shadow-[0_2px_10px_rgba(212,175,55,0.02)]' 
                    : 'text-[#5C544C] hover:text-[#2D241E] hover:bg-white/70 border-[#E8E2D8] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-1.5 md:gap-2.5">
                  <t.icon size={13} className={`md:w-[15px] md:h-[15px] ${activeTab === t.id ? 'text-[#8C1D1D]' : ''}`} />
                  <span className="hidden md:inline">{t.label}</span>
                  <span className="md:hidden">{t.label.split(' ')[0]}</span>
                </span>
                {t.id === 'orders' && pendingOrders > 0 && (
                  <span className="bg-rose-500 text-[#2D241E] text-[8px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 rounded-full ml-1">
                    {pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer info in sidebar — hidden on mobile */}
        <div className="hidden md:flex p-4 border-t border-[#E8E2D8] items-center justify-between shrink-0">
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-[10px] font-bold text-rose-400 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-2.5 rounded-xl border border-rose-500/15 transition-all w-full justify-center"
          >
            <LogOut size={12} /> End Admin Session
          </button>
        </div>
        {/* Logout button visible on mobile */}
        <div className="md:hidden p-2 border-t border-[#E8E2D8] flex justify-center">
          <button onClick={logout} className="text-[9px] font-bold text-rose-400 bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/15">
            <LogOut size={10} className="inline mr-1" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex flex-col min-w-0 bg-transparent">
        {/* TOP BAR */}
        <header className="h-16 border-b border-[#E8E2D8] bg-white/30 backdrop-blur-md/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[#5C544C] font-bold tracking-wider uppercase">Active Session &bull; Secured Connection</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData} 
              className="p-2 rounded-lg hover:bg-white/70 border-[#E8E2D8] text-[#5C544C] hover:text-[#2D241E] transition-colors border border-transparent hover:border-[#E8E2D8]"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div ref={mainContentRef} className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} color="bg-blue-500/10 text-blue-400" />
                <StatCard icon={DollarSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} color="bg-emerald-500/10 text-emerald-400" />
                <StatCard icon={Clock} label="Enquiries Pipeline" value={enquiries.length} color="bg-amber-500/10 text-amber-400" />
                <StatCard icon={Package} label="Inventory Items" value={products.length} color="bg-purple-500/10 text-purple-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Card */}
                <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-sm text-[#2D241E]">Recent Sales Orders</h3>
                    <button onClick={() => handleTabChange('orders')} className="text-xs text-[#8C1D1D] font-bold hover:underline flex items-center gap-1">
                      View Log <ChevronRight size={12} />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-[#2A2A24]/60 flex-grow">
                    {orders.slice(0, 5).map((o: any) => (
                      <div 
                        key={o.id} 
                        onClick={() => { setInspectedOrder(o); handleTabChange('orders'); }}
                        className="flex items-center justify-between py-3.5 hover:bg-white/70 border-[#E8E2D8]/40 px-2 rounded-xl transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-xs text-[#8C1D1D] group-hover:text-[#FF8A6B] transition-colors">{o.order_number}</div>
                          <div className="text-[10px] text-[#5C544C] mt-0.5">{o.customer_name}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs">₹{o.total_amount?.toLocaleString('en-IN')}</span>
                          <StatusBadge status={o.status} />
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-[#5C544C] text-xs text-center py-12">No orders recorded yet</div>
                    )}
                  </div>
                </div>

                {/* Recent Messages Card */}
                <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-sm text-[#2D241E]">Recent Inquiry Messages</h3>
                    <button onClick={() => handleTabChange('messages')} className="text-xs text-[#8C1D1D] font-bold hover:underline flex items-center gap-1">
                      Open Inbox <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="divide-y divide-[#2A2A24]/60 flex-grow border-b border-[#E8E2D8]/30 mb-3">
                    {messages.slice(0, 5).map((m: any) => (
                      <div key={m.id} className="py-3.5 px-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-xs text-[#2D241E]">{m.name}</span>
                          <span className="text-[9px] text-[#5C544C] font-semibold">{new Date(m.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-[10px] text-[#5C544C] line-clamp-2 leading-relaxed">
                          <span className="text-[#8C1D1D] font-semibold">{m.subject}:</span> {m.message}
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-[#5C544C] text-xs text-center py-12">No messages in inbox</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FUTURISTIC DATA INTELLIGENCE TAB */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[#2D241E]">Futuristic Business Growth & Analytics</h2>
                <p className="text-xs text-[#5C544C] mt-1">Deep analysis metrics, geographical demand trends, and AI-driven growth parameters</p>
              </div>

              {/* Top AI Advisor HUD */}
              <div className="bg-gradient-to-r from-[var(--color-coral)]/10 to-[#141412] border border-[#FF8A6B]/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-coral)]/5 blur-xl rounded-full" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#8C1D1D] flex items-center gap-2 mb-4">
                  <Cpu size={16} className="text-[#8C1D1D] animate-pulse" />
                  AI Business Growth Engine Recommendations
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  {aiGrowthAdvices.map((advice, i) => (
                    <div key={i} className="flex gap-2 items-start border-l border-[#FF8A6B]/30 pl-3">
                      <span className="text-[#8C1D1D]">&gt;</span>
                      <p className="text-[#5C544C] leading-relaxed" dangerouslySetInnerHTML={{ __html: advice.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#2D241E]">$1</strong>') }} />
                    </div>
                  ))}
                  {aiGrowthAdvices.length === 0 && (
                    <p className="text-[#5C544C]">&gt; Analyzing database metrics...</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Custom SVG Line Chart for revenue timeline */}
                <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-sm text-[#2D241E]">Total Cumulative Sales Growth</h3>
                    <p className="text-[10px] text-[#5C544C]">Historical transaction volume progression curve</p>
                  </div>
                  
                  {/* SVG Chart */}
                  <div className="w-full h-44 bg-transparent/40 border border-[#E8E2D8]/40 rounded-xl p-3 relative flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 500 150" className="w-full h-full">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF8A6B" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#FF8A6B" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#2A2A24" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#2A2A24" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#2A2A24" strokeWidth="0.5" strokeDasharray="3 3" />
                      
                      {/* Gradient Fill under line */}
                      <path d={`M0,150 L${getChartPoints()} L500,150 Z`} fill="url(#chartGlow)" />
                      
                      {/* Chart Line */}
                      <polyline
                        fill="none"
                        stroke="#FF8A6B"
                        strokeWidth="2.5"
                        points={getChartPoints()}
                        className="drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                      />
                    </svg>
                    <div className="absolute top-2 right-4 text-[9px] font-bold text-[#8C1D1D]">Cumulative Net Revenue</div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#5C544C] mt-3 uppercase tracking-wider">
                    <span>First Order</span>
                    <span>Recent Date</span>
                  </div>
                </div>

                {/* Town Demand Density */}
                <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#2D241E]">Town Demand Density</h3>
                    <p className="text-[10px] text-[#5C544C] mb-4">Combined sales volume & enquiry estimates by town</p>
                  </div>

                  <div className="space-y-4 max-h-48 overflow-y-auto pr-1 scrollbar-thin flex-grow">
                    {Object.entries(
                      (() => {
                        const townsData: Record<string, number> = {};
                        orders.forEach(o => {
                          const town = (o.customer_city || 'Unknown').trim();
                          if (!town) return;
                          const normalized = town.charAt(0).toUpperCase() + town.slice(1).toLowerCase();
                          townsData[normalized] = (townsData[normalized] || 0) + (o.total_amount || 0);
                        });
                        enquiries.forEach(e => {
                          const town = (e.customer_city || 'Unknown').trim();
                          if (!town) return;
                          const normalized = town.charAt(0).toUpperCase() + town.slice(1).toLowerCase();
                          townsData[normalized] = (townsData[normalized] || 0) + (e.total_amount || 0);
                        });
                        return townsData;
                      })()
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([town, amt]) => {
                        const totalCombined = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0) + enquiries.reduce((s: number, e: any) => s + (e.total_amount || 0), 0);
                        const percent = totalCombined > 0 ? Math.round((amt / totalCombined) * 100) : 0;
                        return (
                          <div key={town} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>{town}</span>
                              <span>₹{amt.toLocaleString('en-IN')} ({percent}%)</span>
                            </div>
                            <div className="h-1.5 bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-coral)] rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    {orders.length === 0 && enquiries.length === 0 && (
                      <div className="text-center py-12 text-[#5C544C] text-xs">No town metrics available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bars categories */}
              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6">
                <h3 className="font-display font-bold text-sm mb-6 text-[#2D241E]">Product Segment sales distribution</h3>
                <div className="space-y-4">
                  {Object.entries(products.reduce((acc: any, p: any) => { 
                    acc[p.category] = (acc[p.category] || 0) + 1; 
                    return acc; 
                  }, {})).map(([cat, count]) => {
                    const percentage = products.length > 0 ? Math.round(((count as number) / products.length) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="capitalize text-[#2D241E]">{cat.replace('-', ' ')}</span>
                          <span className="text-[#5C544C]">{count as number} products ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${percentage}%` }} 
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] rounded-full" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS LOG TAB */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Sales Orders Log</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Review orders list, inspect invoices, print receipts and update logs</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-60">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C544C]" />
                    <input 
                      type="text" 
                      placeholder="Search by order ID, name..." 
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      className="w-full bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#2D241E] placeholder-[#A0A090]/40 focus:border-[#FF8A6B] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Actions */}
                  <button 
                    onClick={() => {
                      const cols = [
                        { key: 'order_number', label: 'Order Number' },
                        { key: 'customer_name', label: 'Customer Name' },
                        { key: 'customer_phone', label: 'Phone' },
                        { key: 'customer_email', label: 'Email' },
                        { key: 'total_amount', label: 'Amount' },
                        { key: 'status', label: 'Status' },
                        { key: 'created_at', label: 'Date' }
                      ];
                      downloadCSV(filteredOrders, cols, 'orders_log');
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Download CSV"
                  >
                    <Download size={14} /> <span className="hidden sm:inline">CSV</span>
                  </button>

                  <button 
                    onClick={() => {
                      const headers = ['Order Number', 'Customer', 'Phone', 'Amount', 'Status', 'Date'];
                      const rows = filteredOrders.map(o => [
                        o.order_number,
                        o.customer_name,
                        o.customer_phone,
                        `₹${o.total_amount?.toLocaleString('en-IN')}`,
                        o.status.toUpperCase(),
                        new Date(o.created_at).toLocaleDateString('en-IN')
                      ]);
                      printLog('Sales Orders Log', headers, rows);
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Print Log"
                  >
                    <Printer size={14} /> <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Order Code</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Products count</th>
                        <th className="p-4 text-right">Invoiced Amount</th>
                        <th className="p-4 text-center">Order Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A24]/40">
                      {filteredOrders.map((o: any) => (
                        <tr key={o.id} className="hover:bg-white/70 border-[#E8E2D8]/20 transition-colors">
                          <td className="p-4 font-bold text-[#8C1D1D]">{o.order_number}</td>
                          <td className="p-4">
                            <div className="font-bold text-[#2D241E]">{o.customer_name}</div>
                            <div className="text-[10px] text-[#5C544C] mt-0.5">{o.customer_phone}</div>
                          </td>
                          <td className="p-4 text-[#5C544C]">
                            {Array.isArray(o.items) ? o.items.length : 0} line items
                          </td>
                          <td className="p-4 text-right font-bold text-[#2D241E]">
                            ₹{o.total_amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-center">
                            <StatusBadge status={o.status} />
                          </td>
                          <td className="p-4 text-center flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setInspectedOrder(o)}
                              className="px-3 py-1.5 bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-lg font-bold text-[#2D241E] hover:text-[#8C1D1D] transition-all flex items-center gap-1.5"
                            >
                              <Eye size={12} /> Inspect
                            </button>
                            <button 
                              onClick={() => handleDeleteOrder(o.id, o.order_number)}
                              className="p-1.5 text-rose-400 hover:bg-rose-450/10 rounded-lg"
                              title="Delete Order"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-16 text-[#5C544C]">No orders found matching the filter query</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* INVENTORY DESK (PRODUCTS) */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Product Inventory</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Review inventory items, import database tables from spreadsheets or seed defaults</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-48">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C544C]" />
                    <input 
                      type="text" 
                      placeholder="Search title, category..." 
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      className="w-full bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#2D241E] placeholder-[#A0A090]/40 focus:border-[#FF8A6B] focus:outline-none transition-colors"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      const cols = [
                        { key: 'name_en', label: 'Product Name (EN)' },
                        { key: 'name_ta', label: 'Product Name (TA)' },
                        { key: 'category', label: 'Category' },
                        { key: 'mrp', label: 'MRP (₹)' },
                        { key: 'price', label: 'Price (₹)' },
                        { key: 'discount_percent', label: 'Discount (%)' },
                        { key: 'in_stock', label: 'In Stock' }
                      ];
                      downloadCSV(filteredProducts, cols, 'product_inventory');
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Download CSV"
                  >
                    <Download size={14} />
                  </button>

                  <button 
                    onClick={() => {
                      const headers = ['Product Name', 'Category', 'MRP', 'Selling Price', 'Discount Saved', 'Status'];
                      const rows = filteredProducts.map(p => [
                        `${p.name_en} ${p.name_ta ? `(${p.name_ta})` : ''}`,
                        p.category.toUpperCase(),
                        `₹${p.mrp}`,
                        `₹${p.price}`,
                        `${p.discount_percent || 0}% OFF`,
                        p.in_stock ? 'IN STOCK' : 'OUT OF STOCK'
                      ]);
                      printLog('Product Inventory Log', headers, rows);
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Print Log"
                  >
                    <Printer size={14} />
                  </button>

                  <button
                    onClick={() => {
                      if (filteredProducts.length === 0) return;
                      const allVisibleSelected = filteredProducts.every(p => selectedProductIds.includes(p.id));
                      if (allVisibleSelected) {
                        // Deselect all visible
                        const visibleIds = new Set(filteredProducts.map(p => p.id));
                        setSelectedProductIds(prev => prev.filter(id => !visibleIds.has(id)));
                      } else {
                        // Select all visible
                        setSelectedProductIds(prev => {
                          const union = new Set([...prev, ...filteredProducts.map(p => p.id)]);
                          return Array.from(union);
                        });
                      }
                    }}
                    className="px-3 py-2.5 rounded-xl bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] text-[#5C544C] hover:text-[#8C1D1D] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Select / Deselect All Visible"
                  >
                    {filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id)) ? 'Deselect All' : 'Select All'}
                  </button>

                  <button 
                    onClick={() => {
                      setCurrentProduct({
                        name_en: '', name_ta: '', category: categories[0]?.id || 'single-sound',
                        discount_percent: parseInt(settings.global_discount) || 60,
                        mrp: 0, price: 0, in_stock: true, is_featured: false
                      });
                      setProductFormOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all shrink-0"
                  >
                    <Plus size={14} /> <span className="hidden sm:inline">Add Crackers</span><span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>

              {/* Bulk actions banner */}
              {selectedProductIds.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-300 font-bold">
                      {selectedProductIds.length} product(s) selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProductIds(filteredProducts.map(p => p.id));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/70 border-[#E8E2D8] hover:bg-[#2A2A24] border border-[#E8E2D8] text-xs font-bold text-[#2D241E] transition-colors cursor-pointer"
                    >
                      Select All Visible
                    </button>
                    <button
                      onClick={() => setSelectedProductIds([])}
                      className="px-3 py-1.5 rounded-lg bg-white/70 border-[#E8E2D8] hover:bg-[#2A2A24] border border-[#E8E2D8] text-xs font-bold text-[#5C544C] transition-colors cursor-pointer"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleBulkDeleteProducts}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-[#2D241E] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Seed Products card */}
              <div className="bg-gradient-to-r from-[var(--color-coral)]/5 via-transparent to-transparent border border-[#FF8A6B]/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2 text-[#2D241E]">
                      <Zap size={16} className="text-[#8C1D1D]" /> Populate Default Product Line
                    </h3>
                    <p className="text-xs text-[#5C544C] mt-1">Insert all default safety-certified Sivakasi products from JSON templates directly into database catalog</p>
                  </div>
                  <button 
                    onClick={seedProducts} 
                    disabled={seeding} 
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs disabled:opacity-50 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all shrink-0"
                  >
                    {seeding ? <RefreshCw size={13} className="animate-spin" /> : <Database size={13} />}
                    {seeding ? 'Seeding...' : 'Seed Default Catalog'}
                  </button>
                </div>
                {seedStatus && (
                  <p className="mt-3 text-xs font-semibold text-[#8C1D1D]">{seedStatus}</p>
                )}
              </div>

              {/* Spreadsheet / CSV upload */}
              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-sm text-[#2D241E]">Import Inventory Spreadsheet / CSV</h3>
                  <div className="flex flex-col items-end gap-1">
                    <a 
                      href="/templates/product_import_template.csv" 
                      download="product_import_template.csv"
                      className="text-[10px] text-[#8C1D1D] hover:underline font-bold flex items-center gap-1"
                    >
                      <Download size={11} /> Download CSV Template
                    </a>
                    <a 
                      href="/templates/product_import_template.xlsx" 
                      download="product_import_template.xlsx"
                      className="text-[10px] text-[#8C1D1D]/75 hover:underline font-bold flex items-center gap-1"
                    >
                      <Download size={11} /> Download Excel Template (.xlsx)
                    </a>
                  </div>
                </div>
                <p className="text-xs text-[#5C544C] mb-5">Upload an Excel `.xlsx` or CSV `.csv` spreadsheet matching the price list format to add/update pricing tables in bulk.</p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <label className="flex-grow flex items-center justify-center gap-3 px-6 py-5 border-2 border-dashed border-[#E8E2D8] hover:border-[#FF8A6B]/40 rounded-xl cursor-pointer bg-white/70 border-[#E8E2D8]/25 transition-all">
                    <Upload size={18} className="text-[#5C544C]" />
                    <span className="text-xs font-bold text-[#5C544C]">{file ? file.name : 'Select spreadsheet file (.xlsx, .csv)'}</span>
                    <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  <button 
                    onClick={handleUpload} 
                    disabled={!file} 
                    className="px-6 py-4 rounded-xl bg-[var(--color-coral)] text-white font-bold text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all disabled:opacity-40 disabled:hover:shadow-none shrink-0 cursor-pointer"
                  >
                    Import Products
                  </button>
                </div>
                {uploadStatus && (
                  <p className="mt-3 text-xs font-semibold text-[#8C1D1D]">{uploadStatus}</p>
                )}
              </div>

              {/* Products Catalog Table */}
              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4 w-10 text-center">
                          <input 
                            type="checkbox"
                            className="accent-[var(--color-coral)] cursor-pointer rounded border-[#E8E2D8]"
                            checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds(prev => {
                                  const union = new Set([...prev, ...filteredProducts.map(p => p.id)]);
                                  return Array.from(union);
                                });
                              } else {
                                const visibleIds = new Set(filteredProducts.map(p => p.id));
                                setSelectedProductIds(prev => prev.filter(id => !visibleIds.has(id)));
                              }
                            }}
                          />
                        </th>
                        <th className="p-4">Label Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Standard MRP</th>
                        <th className="p-4 text-right">Discounted Price</th>
                        <th className="p-4 text-center">Discount saved</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A24]/40">
                      {filteredProducts.map((p: any) => (
                        <tr key={p.id} className={`hover:bg-white/70 border-[#E8E2D8]/20 transition-colors ${selectedProductIds.includes(p.id) ? 'bg-[var(--color-coral)]/5' : ''}`}>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              className="accent-[var(--color-coral)] cursor-pointer rounded border-[#E8E2D8]"
                              checked={selectedProductIds.includes(p.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds(prev => [...prev, p.id]);
                                } else {
                                  setSelectedProductIds(prev => prev.filter(id => id !== p.id));
                                }
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#2D241E]">{p.name_en}</div>
                            {p.name_ta && <div className="text-[10px] text-[#5C544C] mt-0.5">{p.name_ta}</div>}
                          </td>
                          <td className="p-4 text-[#5C544C] font-medium capitalize">{p.category}</td>
                          <td className="p-4 text-right line-through text-[#5C544C]">₹{p.mrp}</td>
                          <td className="p-4 text-right font-bold text-[#8C1D1D]">₹{p.price}</td>
                          <td className="p-4 text-center text-emerald-400 font-bold">{p.discount_percent || 0}% OFF</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleProductStock(p)}
                              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                p.in_stock
                                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15 hover:bg-emerald-500/20'
                                  : 'text-rose-400 bg-rose-500/10 border-rose-500/15 hover:bg-rose-500/20'
                              }`}
                              title="Click to toggle stock status"
                            >
                              {p.in_stock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-4 text-center flex items-center justify-center gap-1">
                            <button 
                              onClick={() => {
                                setCurrentProduct(p);
                                setProductFormOpen(true);
                              }}
                              className="p-2 text-[#8C1D1D] hover:bg-white/70 border-[#E8E2D8] rounded-lg"
                              title="Edit Product"
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id, p.name_en)} 
                              className="p-2 text-rose-455 hover:bg-rose-450/10 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16 text-[#5C544C]">No products found matching the query list</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* COMBOS TAB */}
          {activeTab === 'combos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Combo Packages</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Manage budget combo giftboxes and featured assortment packs</p>
                </div>
                
                <button 
                  onClick={() => {
                    setCurrentCombo({
                      combo_name: '', total_items: 0, original_price: 0,
                      offer_price: 0, combo_type: 'Special Box', description: '',
                      products: [], featured: false
                    });
                    setComboFormOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all shrink-0"
                >
                  <Plus size={14} /> Add Combo
                </button>
              </div>

              {/* Seed Combos card */}
              <div className="bg-gradient-to-r from-[var(--color-coral)]/5 via-transparent to-transparent border border-[#FF8A6B]/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2 text-[#2D241E]">
                      <Gift size={16} className="text-[#8C1D1D]" /> Populate Initial Assortment Combos
                    </h3>
                    <p className="text-xs text-[#5C544C] mt-1">Load the young kids, young couple, and premium family combos to seed the database catalog</p>
                  </div>
                  <button 
                    onClick={seedCombos} 
                    disabled={seedingCombos} 
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs disabled:opacity-50 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all shrink-0"
                  >
                    {seedingCombos ? <RefreshCw size={13} className="animate-spin" /> : <Database size={13} />}
                    {seedingCombos ? 'Seeding Database...' : 'Seed Default Combos'}
                  </button>
                </div>
                {seedComboStatus && (
                  <p className="mt-3 text-xs font-semibold text-[#8C1D1D]">{seedComboStatus}</p>
                )}
              </div>

              {/* Combo table */}
              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Combo Identifier Name</th>
                        <th className="p-4 text-center">Items Included</th>
                        <th className="p-4 text-right">Standard MRP</th>
                        <th className="p-4 text-right">Offer Sale Price</th>
                        <th className="p-4 text-center">Featured status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A24]/40">
                      {combos.map((c: any) => (
                        <tr key={c.id} className="hover:bg-white/70 border-[#E8E2D8]/20 transition-colors">
                          <td className="p-4 font-bold text-[#2D241E]">{c.combo_name}</td>
                          <td className="p-4 text-center text-[#5C544C] font-bold">{c.total_items} items</td>
                          <td className="p-4 text-right line-through text-[#5C544C]">₹{c.original_price}</td>
                          <td className="p-4 text-right font-bold text-[#8C1D1D]">₹{c.offer_price}</td>
                          <td className="p-4 text-center">
                            {c.featured ? (
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">Featured</span>
                            ) : (
                              <span className="text-[#5C544C]">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center flex items-center justify-center gap-1">
                            <button 
                              onClick={() => {
                                setCurrentCombo(c);
                                setComboFormOpen(true);
                              }}
                              className="p-2 text-[#8C1D1D] hover:bg-white/70 border-[#E8E2D8] rounded-lg"
                              title="Edit Combo"
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCombo(c.id, c.combo_name)} 
                              className="p-2 text-rose-455 hover:bg-rose-450/10 rounded-lg transition-colors"
                              title="Delete Combo"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {combos.length === 0 && (
                    <div className="text-center py-16 text-[#5C544C]">No combo packs found. Initialize by clicking &quot;Seed Default Combos&quot; above.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* CATEGORIES DESK TAB */}
          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Product Categories</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Manage catalog filters and sections displayed to customers</p>
                </div>
                
                <button 
                  onClick={() => {
                    setCurrentCategory({ id: '', label: '', emoji: '🎆', sort_order: 0, isNew: true });
                    setCategoryFormOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {/* Spreadsheet / CSV upload */}
              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-sm text-[#2D241E]">Import Products to Categories via Spreadsheet / CSV</h3>
                  <div className="flex flex-col items-end gap-1">
                    <a 
                      href="/templates/product_import_template.csv" 
                      download="product_import_template.csv"
                      className="text-[10px] text-[#8C1D1D] hover:underline font-bold flex items-center gap-1"
                    >
                      <Download size={11} /> Download CSV Template
                    </a>
                    <a 
                      href="/templates/product_import_template.xlsx" 
                      download="product_import_template.xlsx"
                      className="text-[10px] text-[#8C1D1D]/75 hover:underline font-bold flex items-center gap-1"
                    >
                      <Download size={11} /> Download Excel Template (.xlsx)
                    </a>
                  </div>
                </div>
                <p className="text-xs text-[#5C544C] mb-5">Seeding new items? Upload a spreadsheet to populate products. Missing categories listed in the spreadsheet will be automatically created.</p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <label className="flex-grow flex items-center justify-center gap-3 px-6 py-5 border-2 border-dashed border-[#E8E2D8] hover:border-[#FF8A6B]/40 rounded-xl cursor-pointer bg-white/70 border-[#E8E2D8]/25 transition-all">
                    <Upload size={18} className="text-[#5C544C]" />
                    <span className="text-xs font-bold text-[#5C544C]">{file ? file.name : 'Select spreadsheet file (.xlsx, .csv)'}</span>
                    <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  <button 
                    onClick={handleUpload} 
                    disabled={!file} 
                    className="px-6 py-4 rounded-xl bg-[var(--color-coral)] text-white font-bold text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all disabled:opacity-40 disabled:hover:shadow-none shrink-0 cursor-pointer"
                  >
                    Import Products
                  </button>
                </div>
                {uploadStatus && (
                  <p className="mt-3 text-xs font-semibold text-[#8C1D1D]">{uploadStatus}</p>
                )}
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Emoji</th>
                      <th className="p-4">Category Identifier</th>
                      <th className="p-4">Display Label Name</th>
                      <th className="p-4 text-center">Sort Order</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A24]/40">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-white/70 border-[#E8E2D8]/20 transition-colors">
                        <td className="p-4 text-lg">{cat.emoji || '🎆'}</td>
                        <td className="p-4 font-mono font-bold text-[#5C544C]">{cat.id}</td>
                        <td className="p-4 font-bold text-[#2D241E]">{cat.label}</td>
                        <td className="p-4 text-center font-bold text-[#8C1D1D]">{cat.sort_order}</td>
                        <td className="p-4 text-center flex items-center justify-center gap-1">
                          <button 
                            onClick={() => {
                              setCurrentCategory({ ...cat, isNew: false });
                              setCategoryFormOpen(true);
                            }}
                            className="p-2 text-[#8C1D1D] hover:bg-white/70 border-[#E8E2D8] rounded-lg"
                            title="Edit Category"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id, cat.label)}
                            className="p-2 text-rose-455 hover:bg-rose-450/10 rounded-lg"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Order Enquiries</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Review enquiries submitted by potential customers listing items cart summary</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const cols = [
                        { key: 'customer_name', label: 'Customer Name' },
                        { key: 'customer_phone', label: 'Phone' },
                        { key: 'total_amount', label: 'Est. Amount' },
                        { key: 'created_at', label: 'Date' }
                      ];
                      downloadCSV(enquiries, cols, 'enquiries_log');
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Download CSV"
                  >
                    <Download size={14} /> <span className="hidden sm:inline">CSV</span>
                  </button>
                  <button 
                    onClick={() => {
                      const headers = ['Customer Name', 'Phone Number', 'Items Count', 'Estimated Order', 'Date'];
                      const rows = enquiries.map(e => [
                        e.customer_name || 'Enquirer Customer',
                        e.customer_phone,
                        `${Array.isArray(e.items) ? e.items.length : 0} items`,
                        `₹${e.total_amount?.toLocaleString('en-IN')}`,
                        new Date(e.created_at).toLocaleString()
                      ]);
                      printLog('Order Enquiries Log', headers, rows);
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Print Log"
                  >
                    <Printer size={14} /> <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="divide-y divide-[#2A2A24]/40">
                  {enquiries.map((e: any) => (
                    <div key={e.id} className="p-5 hover:bg-white/70 border-[#E8E2D8]/10 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <div>
                          <span className="font-bold text-sm text-[#2D241E]">{e.customer_name || 'Enquirer Customer'}</span>
                          <span className="text-[10px] text-[#5C544C] font-semibold bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] px-2 py-0.5 rounded-full ml-2">Phone: {e.customer_phone}</span>
                        </div>
                        <span className="text-[10px] text-[#5C544C] font-semibold">{new Date(e.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-[#5C544C] flex items-center gap-4">
                        <span>Items: <strong className="text-[#2D241E]">{Array.isArray(e.items) ? e.items.length : 0} types</strong></span>
                        <span>Estimated Order: <strong className="text-[#8C1D1D]">₹{e.total_amount?.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>
                  ))}
                  {enquiries.length === 0 && (
                    <div className="text-center py-16 text-[#5C544C]">No enquiries logged in database</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Inbox Messages</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Review details from customers submitted through the web contact support forms</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const cols = [
                        { key: 'name', label: 'Name' },
                        { key: 'email', label: 'Email' },
                        { key: 'subject', label: 'Subject' },
                        { key: 'message', label: 'Message' },
                        { key: 'created_at', label: 'Date' }
                      ];
                      downloadCSV(messages, cols, 'inbox_messages');
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Download CSV"
                  >
                    <Download size={14} /> <span className="hidden sm:inline">CSV</span>
                  </button>
                  <button 
                    onClick={() => {
                      const headers = ['Sender', 'Email', 'Subject', 'Message Details', 'Date'];
                      const rows = messages.map(m => [
                        m.name,
                        m.email,
                        m.subject,
                        m.message,
                        new Date(m.created_at).toLocaleString()
                      ]);
                      printLog('Inbox Messages Log', headers, rows);
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Print Log"
                  >
                    <Printer size={14} /> <span className="hidden sm:inline">Print</span>
                  </button>
                  {messages.length > 0 && (
                    <button 
                      onClick={handleDeleteAllMessages}
                      className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 size={14} /> Clear Inbox
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <div className="divide-y divide-[#2A2A24]/40">
                  {messages.map((m: any) => (
                    <div key={m.id} className="p-6 hover:bg-white/70 border-[#E8E2D8]/10 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <div>
                          <span className="font-bold text-sm text-[#2D241E]">{m.name}</span>
                          <span className="text-xs text-[#5C544C] ml-2">Email: {m.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-[#5C544C] font-semibold">{new Date(m.created_at).toLocaleString()}</span>
                          <button 
                            onClick={() => handleDeleteMessage(m.id, m.name)}
                            className="p-1.5 text-[#5C544C] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Message"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#8C1D1D] mb-2">{m.subject}</div>
                      <p className="text-xs text-[#5C544C] leading-relaxed bg-white/70 border-[#E8E2D8]/40 border border-[#E8E2D8]/60 p-4 rounded-xl">{m.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-16 text-[#5C544C]">No contact messages recorded</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* CUSTOMERS BASE TAB */}
          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Customer Profiles</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Profiles compiled from orders logs</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const cols = [
                        { key: 'name', label: 'Customer Name' },
                        { key: 'phone', label: 'Phone Number' },
                        { key: 'email', label: 'Email' },
                        { key: 'ordersCount', label: 'Orders Count' },
                        { key: 'totalSpent', label: 'Total Spent' }
                      ];
                      downloadCSV(customersList, cols, 'customer_profiles');
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Download CSV"
                  >
                    <Download size={14} /> <span className="hidden sm:inline">CSV</span>
                  </button>
                  <button 
                    onClick={() => {
                      const headers = ['Customer Name', 'Phone Number', 'Email Address', 'Orders Placed', 'Total Spent'];
                      const rows = customersList.map(c => [
                        c.name,
                        c.phone,
                        c.email,
                        `${c.ordersCount} orders`,
                        `₹${c.totalSpent?.toLocaleString('en-IN')}`
                      ]);
                      printLog('Customer Profiles Base', headers, rows);
                    }}
                    className="p-2.5 bg-white/30 backdrop-blur-md hover:bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] hover:border-[#FF8A6B] rounded-xl text-[#5C544C] hover:text-[#8C1D1D] transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    title="Print Log"
                  >
                    <Printer size={14} /> <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4 text-center">Orders Placed</th>
                      <th className="p-4 text-right">Total Net Worth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A24]/40">
                    {customersList.map((c: any) => (
                      <tr key={c.phone} className="hover:bg-white/70 border-[#E8E2D8]/20 transition-colors">
                        <td className="p-4 font-bold text-[#2D241E]">{c.name}</td>
                        <td className="p-4 font-mono font-semibold">{c.phone}</td>
                        <td className="p-4 text-[#5C544C]">{c.email}</td>
                        <td className="p-4 text-center font-bold text-[#8C1D1D]">{c.ordersCount} orders</td>
                        <td className="p-4 text-right font-bold text-emerald-400">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    {customersList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-[#5C544C]">No customers recorded yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* BANK ACCOUNTS TAB */}
          {activeTab === 'bank-accounts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Bank Accounts</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Manage payment transfer options shown during client checkouts</p>
                </div>
                
                <button 
                  onClick={() => {
                    setCurrentBank({ bank_name: '', branch: '', holder_name: '', account_number: '', ifsc_code: '', gpay_number: '', phonepe_number: '' });
                    setBankFormOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
                >
                  <Plus size={14} /> Add Bank Details
                </button>
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Bank Name</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">Holder Name</th>
                      <th className="p-4">Account Number</th>
                      <th className="p-4">IFSC Code</th>
                      <th className="p-4">GPay / PhonePe</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A24]/40">
                    {bankAccounts.map((b) => (
                      <tr key={b.id} className="hover:bg-white/70 border-[#E8E2D8]/20 transition-colors">
                        <td className="p-4 font-bold text-[#2D241E]">{b.bank_name}</td>
                        <td className="p-4 text-[#5C544C] font-medium">{b.branch}</td>
                        <td className="p-4 font-bold">{b.holder_name}</td>
                        <td className="p-4 font-mono font-semibold">{b.account_number}</td>
                        <td className="p-4 font-mono font-semibold text-[#8C1D1D]">{b.ifsc_code}</td>
                        <td className="p-4 text-[#5C544C]">{b.gpay_number || '-'}</td>
                        <td className="p-4 text-center flex items-center justify-center gap-1">
                          <button 
                            onClick={() => {
                              setCurrentBank(b);
                              setBankFormOpen(true);
                            }}
                            className="p-2 text-[#8C1D1D] hover:bg-white/70 border-[#E8E2D8] rounded-lg"
                            title="Edit Bank Details"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteBank(b.id, b.bank_name)}
                            className="p-2 text-rose-455 hover:bg-rose-450/10 rounded-lg"
                            title="Delete Bank Details"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* HOMEPAGE BANNERS / SLIDERS */}
          {activeTab === 'sliders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-display text-[#2D241E]">Homepage Slider Banners</h2>
                  <p className="text-xs text-[#5C544C] mt-1">Manage glowing visual sliders featured on the client web pages</p>
                </div>
                
                <button 
                  onClick={() => {
                    setCurrentSlider({ image_url: '', link_url: '', title: '', sort_order: 0 });
                    setSliderFormOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
                >
                  <Plus size={14} /> Add Banner
                </button>
              </div>

              <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] bg-white/70 border-[#E8E2D8]/40 text-[#5C544C] font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Sort Order</th>
                      <th className="p-4">Banner Graphic</th>
                      <th className="p-4">Header Title</th>
                      <th className="p-4">Action URL</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A24]/40">
                    {sliders.map((s) => (
                      <tr key={s.id} className="hover:bg-white/70 border-[#E8E2D8]/20 transition-colors">
                        <td className="p-4 text-center font-bold text-[#8C1D1D]">{s.sort_order}</td>
                        <td className="p-4">
                          <div className="relative w-28 h-12 bg-black rounded-lg overflow-hidden border border-[#E8E2D8]">
                            <img src={s.image_url} alt="" className="object-cover w-full h-full" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#2D241E]">{s.title || '-'}</td>
                        <td className="p-4 text-xs font-mono text-[#5C544C]">{s.link_url || '-'}</td>
                        <td className="p-4 text-center flex items-center justify-center gap-1">
                          <button 
                            onClick={() => {
                              setCurrentSlider(s);
                              setSliderFormOpen(true);
                            }}
                            className="p-2 text-[#8C1D1D] hover:bg-white/70 border-[#E8E2D8] rounded-lg"
                            title="Edit Banner"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSlider(s.id)}
                            className="p-2 text-rose-455 hover:bg-rose-450/10 rounded-lg"
                            title="Delete Banner"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sliders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-[#5C544C]">No homepage banners uploaded yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* SETTINGS & CONFIG TAB */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display text-[#2D241E]">Global System Configurations</h2>
                <p className="text-xs text-[#5C544C] mt-1">Manage global discount rates, minimum orders, WhatsApp parameters, and company addresses</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-8 space-y-6 max-w-3xl">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Global Discount (%) *</label>
                    <input 
                      required 
                      type="number" 
                      min="0" max="100" 
                      value={settings.global_discount} 
                      onChange={(e) => setSettings({...settings, global_discount: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                    <span className="text-[9px] text-[#5C544C] mt-1.5 block leading-normal">
                      ⚠️ Updates prices for ALL catalog items off MRP dynamically upon save.
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Minimum Order Value (₹) *</label>
                    <input 
                      required 
                      type="number" 
                      min="0" 
                      value={settings.min_order_value} 
                      onChange={(e) => setSettings({...settings, min_order_value: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Company Registered Name *</label>
                    <input 
                      required 
                      value={settings.company_name} 
                      onChange={(e) => setSettings({...settings, company_name: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Support/Enquiry Email Address *</label>
                    <input 
                      required 
                      type="email" 
                      value={settings.email_address} 
                      onChange={(e) => setSettings({...settings, email_address: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">WhatsApp Contact Number *</label>
                    <input 
                      required 
                      value={settings.whatsapp_number} 
                      onChange={(e) => setSettings({...settings, whatsapp_number: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Mobile Number Line 1 *</label>
                    <input 
                      required 
                      value={settings.mobile_number_1} 
                      onChange={(e) => setSettings({...settings, mobile_number_1: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Mobile Number Line 2</label>
                    <input 
                      value={settings.mobile_number_2} 
                      onChange={(e) => setSettings({...settings, mobile_number_2: e.target.value})} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Company Physical Address *</label>
                  <textarea 
                    required 
                    rows={2} 
                    value={settings.company_address} 
                    onChange={(e) => setSettings({...settings, company_address: e.target.value})} 
                    className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors resize-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Header Alert Marquee Text</label>
                  <input 
                    value={settings.marquee} 
                    onChange={(e) => setSettings({...settings, marquee: e.target.value})} 
                    className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none transition-colors" 
                    placeholder="E.g., Grand Diwali festival booking open! Place your order soon."
                  />
                </div>

                {/* WHATSAPP API & NOTIFICATIONS SETTINGS */}
                <div className="border-t border-[#E8E2D8]/60 pt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold font-display text-[#8C1D1D]">WhatsApp API & Notifications Settings</h3>
                    <p className="text-[10px] text-[#5C544C] mt-1">Configure automated notifications via Meta Business API or UltraMsg</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">WhatsApp Provider *</label>
                      <select 
                        value={settings.whatsapp_provider || 'none'} 
                        onChange={(e) => setSettings({...settings, whatsapp_provider: e.target.value})} 
                        className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none cursor-pointer"
                      >
                        <option value="none">None / Disabled</option>
                        <option value="ultramsg">UltraMsg (Unofficial Gateway)</option>
                        <option value="whatsapp_business">Meta WhatsApp Business API (Official)</option>
                      </select>
                    </div>

                    {(settings.whatsapp_provider === 'whatsapp_business') && (
                      <div>
                        <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Meta Template Name *</label>
                        <input 
                          value={settings.whatsapp_template_name || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_template_name: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none" 
                          placeholder="e.g. order_status_update"
                        />
                      </div>
                    )}
                  </div>

                  {settings.whatsapp_provider === 'whatsapp_business' && (
                    <div className="grid sm:grid-cols-2 gap-6 bg-white/70 border-[#E8E2D8]/40 p-4 border border-[#E8E2D8] rounded-xl">
                      <div>
                        <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Meta Phone Number ID *</label>
                        <input 
                          value={settings.whatsapp_business_phone_number_id || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_business_phone_number_id: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">Meta System User Access Token *</label>
                        <input 
                          type="password" 
                          value={settings.whatsapp_business_access_token || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_business_access_token: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none" 
                        />
                      </div>
                    </div>
                  )}

                  {settings.whatsapp_provider === 'ultramsg' && (
                    <div className="grid sm:grid-cols-2 gap-6 bg-white/70 border-[#E8E2D8]/40 p-4 border border-[#E8E2D8] rounded-xl">
                      <div>
                        <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">UltraMsg Instance ID *</label>
                        <input 
                          value={settings.whatsapp_ultramsg_instance_id || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_ultramsg_instance_id: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#5C544C] mb-2 uppercase tracking-wider">UltraMsg Access Token *</label>
                        <input 
                          type="password" 
                          value={settings.whatsapp_ultramsg_token || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_ultramsg_token: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-4 py-3 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Status Custom Messages */}
                  <div className="space-y-4 bg-white/70 border-[#E8E2D8]/20 p-4 border border-[#E8E2D8]/40 rounded-2xl">
                    <div className="text-[10px] font-bold text-[#5C544C] uppercase tracking-wider">Status Update Message Templates (WhatsApp & Email)</div>
                    <p className="text-[9px] text-[#5C544C] -mt-1 leading-normal">
                      Use placeholders like <code className="text-[#8C1D1D] font-mono font-bold">{"{{customer_name}}"}</code>, <code className="text-[#8C1D1D] font-mono font-bold">{"{{order_number}}"}</code>, and <code className="text-[#8C1D1D] font-mono font-bold">{"{{tracking_info}}"}</code> to insert values dynamically.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Pending Status Message</label>
                        <textarea 
                          rows={2} 
                          value={settings.whatsapp_msg_pending || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_msg_pending: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Confirmed Status Message</label>
                        <textarea 
                          rows={2} 
                          value={settings.whatsapp_msg_confirmed || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_msg_confirmed: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none" 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Processing Status Message</label>
                        <textarea 
                          rows={2} 
                          value={settings.whatsapp_msg_processing || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_msg_processing: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Shipped Status Message</label>
                        <textarea 
                          rows={2} 
                          value={settings.whatsapp_msg_shipped || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_msg_shipped: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none" 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Delivered Status Message</label>
                        <textarea 
                          rows={2} 
                          value={settings.whatsapp_msg_delivered || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_msg_delivered: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Cancelled Status Message</label>
                        <textarea 
                          rows={2} 
                          value={settings.whatsapp_msg_cancelled || ''} 
                          onChange={(e) => setSettings({...settings, whatsapp_msg_cancelled: e.target.value})} 
                          className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-xs text-[#8C1D1D] font-bold">{settingsStatus}</span>
                  <button 
                    type="submit" 
                    disabled={savingSettings}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold text-xs hover:shadow-[0_8px_24px_rgba(255,107,74,0.25)] disabled:opacity-50 shrink-0"
                  >
                    {savingSettings ? 'Saving Settings...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* SYSTEM DIAGNOSTICS TAB */}
          {activeTab === 'diagnostics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[#2D241E]">System Diagnostics & Tracking Logs</h2>
                <p className="text-xs text-[#5C544C] mt-1">Review live application error logs, tracking information, and system event triggers</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Error Logs Card */}
                <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <h3 className="font-display font-bold text-xs text-[#2D241E] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      Trapped Error Logs ({errorLogs.length})
                    </h3>
                    {errorLogs.length > 0 && (
                      <button 
                        onClick={handleDeleteAllErrorLogs}
                        className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Trash2 size={11} /> Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-grow overflow-y-auto divide-y divide-[#2A2A24]/60 pr-1 scrollbar-thin">
                    {errorLogs.map((log) => (
                      <div key={log.id} className="py-3.5 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                            {log.error_type}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] text-[#5C544C] font-semibold">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                            <button 
                              onClick={() => handleDeleteErrorLog(log.id)}
                              className="text-[#5C544C] hover:text-rose-400 p-0.5 rounded transition-colors"
                              title="Delete log"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#2D241E] font-medium leading-normal">
                          {log.message}
                        </p>
                      </div>
                    ))}
                    {errorLogs.length === 0 && (
                      <div className="text-[#5C544C] text-xs text-center py-24">No errors trapped in logs yet</div>
                    )}
                  </div>
                </div>

                {/* Analytics Events Card */}
                <div className="bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-2xl p-6 flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-5 shrink-0">
                    <h3 className="font-display font-bold text-xs text-[#2D241E] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Event Activity Stream ({analyticsEvents.length})
                    </h3>
                    {analyticsEvents.length > 0 && (
                      <button 
                        onClick={handleDeleteAllAnalyticsEvents}
                        className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Trash2 size={11} /> Clear All
                      </button>
                    )}
                  </div>

                  <div className="flex-grow overflow-y-auto divide-y divide-[#2A2A24]/60 pr-1 scrollbar-thin">
                    {analyticsEvents.map((event) => (
                      <div key={event.id} className="py-3.5 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            {event.event_name}
                          </span>
                          <span className="text-[8px] text-[#5C544C] font-semibold">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C544C]">
                          Context: {JSON.stringify(event.metadata || event.event_data)}
                        </p>
                      </div>
                    ))}
                    {analyticsEvents.length === 0 && (
                      <div className="text-[#5C544C] text-xs text-center py-24">No live event signals detected</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* INSPECTED ORDER PANEL (FLYOUT) */}
      <AnimatePresence>
        {inspectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setInspectedOrder(null)} />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white/30 backdrop-blur-md border-l border-[#E8E2D8] shadow-2xl z-50 p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#8C1D1D]">{inspectedOrder.order_number}</h3>
                    <p className="text-[9px] text-[#5C544C] uppercase tracking-wider font-bold">Placed on {new Date(inspectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setInspectedOrder(null)} className="p-2 hover:bg-white/70 border-[#E8E2D8] rounded-xl text-[#5C544C] hover:text-[#2D241E]"><X size={16} /></button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Customer Block */}
                  <div>
                    <div className="text-[10px] text-[#5C544C] font-bold uppercase tracking-wider mb-2">Customer Profile</div>
                    <div className="bg-white/70 border-[#E8E2D8]/60 border border-[#E8E2D8] rounded-xl p-4 space-y-2">
                      <div className="font-bold text-[#2D241E]">{inspectedOrder.customer_name}</div>
                      <div>📞 {inspectedOrder.customer_phone}</div>
                      <div>✉️ {inspectedOrder.customer_email || 'N/A'}</div>
                      <div className="pt-2 border-t border-[#E8E2D8]/40 mt-1 flex gap-2 items-start text-[#5C544C]">
                        <MapPin size={12} className="shrink-0 mt-0.5 text-[#8C1D1D]" />
                        <span>{[inspectedOrder.customer_address, inspectedOrder.customer_city, inspectedOrder.customer_pincode].filter(Boolean).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div>
                    <div className="text-[10px] text-[#5C544C] font-bold uppercase tracking-wider mb-2">Ordered Assortment ({Array.isArray(inspectedOrder.items) ? inspectedOrder.items.length : 0})</div>
                    <div className="bg-white/70 border-[#E8E2D8]/60 border border-[#E8E2D8] rounded-xl p-4 divide-y divide-[#2A2A24]/40 max-h-48 overflow-y-auto scrollbar-thin">
                      {Array.isArray(inspectedOrder.items) && inspectedOrder.items.map((i: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-2 text-[11px] first:pt-0 last:pb-0">
                          <span>{i.quantity}x {i.name || i.product_name}</span>
                          <span className="font-bold">₹{((i.price || 0) * (i.quantity || 1)).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-2">
                    <div className="bg-white/70 border-[#E8E2D8]/40 border border-[#E8E2D8]/60 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-[#5C544C]"><span>Subtotal</span><span>₹{(inspectedOrder.subtotal || inspectedOrder.total_amount).toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between text-emerald-400"><span>Savings discount</span><span>-₹{(inspectedOrder.discount_total || 0).toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#E8E2D8]/60"><span>Grand Total</span><span className="text-[#8C1D1D]">₹{inspectedOrder.total_amount?.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                </div>

                {/* Status selection */}
                <div>
                  <div className="text-[10px] text-[#5C544C] font-bold uppercase tracking-wider mb-2.5">Progress Stage Status</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => {
                          if (s === 'shipped') {
                            const tracking = prompt("Enter tracking/lorry details (optional):", trackingInfo);
                            if (tracking !== null) {
                              setTrackingInfo(tracking);
                              updateOrderStatus(inspectedOrder.id, s, tracking);
                            }
                          } else {
                            updateOrderStatus(inspectedOrder.id, s);
                          }
                        }}
                        className={`py-2 rounded-lg font-bold text-[10px] uppercase border transition-all ${
                          inspectedOrder.status === s 
                            ? 'bg-[var(--color-coral)] text-white border-[#FF8A6B]' 
                            : 'bg-white/70 border-[#E8E2D8] border-[#E8E2D8] text-[#5C544C] hover:text-[#2D241E]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WhatsApp & Email Status Notification Card */}
                <div className="bg-white/70 border-[#E8E2D8]/60 border border-[#E8E2D8] rounded-xl p-4 mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#5C544C] font-bold uppercase tracking-wider">Status Notification</span>
                    <span className="text-[9px] bg-green-wa/10 text-green-wa border border-green-wa/20 px-2 py-0.5 rounded-md uppercase font-bold">Automatic</span>
                  </div>
                  <p className="text-[10px] text-[#5C544C] leading-relaxed">
                    Notifications are automatically sent to both WhatsApp & Email when the order status changes. You can also customize or resend messages below manually.
                  </p>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-4 text-[11px] font-bold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyWhatsApp} 
                        onChange={(e) => setNotifyWhatsApp(e.target.checked)} 
                        className="rounded bg-white/70 border-[#E8E2D8] border-[#E8E2D8] text-[#8C1D1D] focus:ring-[var(--color-coral)]"
                      />
                      WhatsApp Update
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyEmail} 
                        onChange={(e) => setNotifyEmail(e.target.checked)} 
                        className="rounded bg-white/70 border-[#E8E2D8] border-[#E8E2D8] text-[#8C1D1D] focus:ring-[var(--color-coral)]"
                      />
                      Email Update
                    </label>
                  </div>

                  {/* Tracking details (shown only if status is shipped) */}
                  {inspectedOrder.status === 'shipped' && (
                    <div>
                      <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Transport / Lorry Tracking Info</label>
                      <input 
                        value={trackingInfo} 
                        onChange={(e) => setTrackingInfo(e.target.value)} 
                        className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none" 
                        placeholder="e.g. VRL Logistics, LR No: 48291"
                      />
                    </div>
                  )}

                  {/* Message Preview */}
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Message Preview (Editable)</label>
                    <textarea 
                      rows={3} 
                      value={customMessageText} 
                      onChange={(e) => setCustomMessageText(e.target.value)} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:border-[#FF8A6B] focus:outline-none resize-none font-medium" 
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button 
                      type="button"
                      onClick={() => handleSendStatusNotification(inspectedOrder)}
                      disabled={sendingNotificationId === inspectedOrder.id || (!notifyWhatsApp && !notifyEmail)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] disabled:from-[#2A2A24] disabled:to-[#2A2A24] text-white disabled:text-[#5C544C] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Send size={13} /> {sendingNotificationId === inspectedOrder.id ? 'Sending...' : 'Send Status Notification'}
                    </button>

                    {notifyWhatsApp && (
                      <button 
                        type="button"
                        onClick={() => {
                          const cleanPhone = inspectedOrder.customer_phone.replace(/[^0-9]/g, '');
                          const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(customMessageText)}`, '_blank');
                        }}
                        className="w-full py-2 bg-transparent hover:bg-white/5 border border-[#E8E2D8] hover:border-[#A0A090] text-[#2D241E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <MessageCircle size={12} /> Open in WhatsApp Web
                      </button>
                    )}
                  </div>

                  {/* Status indicator */}
                  {notificationStatus && (
                    <p className={`text-[10px] font-bold text-center mt-1.5 ${notificationStatus.startsWith('❌') ? 'text-rose-400' : 'text-[#8C1D1D]'}`}>
                      {notificationStatus}
                    </p>
                  )}
                </div>
              </div>

              {/* PDF Receipts Actions */}
              <div className="pt-6 border-t border-[#E8E2D8] space-y-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleManualReceiptDownload(inspectedOrder)}
                    className="flex-1 py-3 bg-white/70 border-[#E8E2D8] hover:bg-[#FF8A6B]/5 border border-[#E8E2D8] hover:border-[#FF8A6B] text-[#2D241E] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Download size={13} /> PDF Invoice
                  </button>
                  <button 
                    onClick={() => handleResendReceiptEmail(inspectedOrder)}
                    disabled={resendingEmailId === inspectedOrder.id}
                    className="flex-1 py-3 bg-[var(--color-coral)] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  >
                    <Send size={13} /> {resendingEmailId === inspectedOrder.id ? 'Resending...' : 'Resend Receipt'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      <AnimatePresence>
        {productFormOpen && currentProduct && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-0" onClick={() => setProductFormOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative z-10 w-full max-w-lg bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-3xl p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex justify-between items-center border-b border-[#E8E2D8] pb-4 mb-6">
                <h3 className="font-display font-bold text-sm text-[#8C1D1D]">{currentProduct.id ? 'Edit Fireworks Product' : 'Add New Fireworks Product'}</h3>
                <button onClick={() => setProductFormOpen(false)} className="p-1.5 text-[#5C544C] hover:text-[#2D241E] rounded-lg"><X size={15} /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Product Name (EN) *</label>
                    <input required value={currentProduct.name_en} onChange={(e) => setCurrentProduct({...currentProduct, name_en: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Product Name (Tamil)</label>
                    <input value={currentProduct.name_ta} onChange={(e) => setCurrentProduct({...currentProduct, name_ta: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Category *</label>
                    <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none cursor-pointer">
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Selling Price (₹) *</label>
                    <input required type="number" value={currentProduct.price} 
                      onChange={(e) => {
                        const priceVal = parseInt(e.target.value) || 0;
                        const disc = currentProduct.discount_percent || 0;
                        const mrpVal = disc < 100 ? Math.round(priceVal / (1 - disc / 100)) : priceVal;
                        setCurrentProduct({...currentProduct, price: priceVal, mrp: mrpVal});
                      }} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Discount Percent (%)</label>
                    <input type="number" min="0" max="99" value={currentProduct.discount_percent || 0} 
                      onChange={(e) => {
                        const discVal = Math.min(99, Math.max(0, parseInt(e.target.value) || 0));
                        const mrpVal = currentProduct.mrp || 0;
                        if (mrpVal > 0) {
                          const priceVal = Math.round(mrpVal * (1 - discVal / 100));
                          setCurrentProduct({...currentProduct, discount_percent: discVal, price: priceVal});
                        } else {
                          const priceVal = currentProduct.price || 0;
                          const calculatedMrp = discVal < 100 ? Math.round(priceVal / (1 - discVal / 100)) : priceVal;
                          setCurrentProduct({...currentProduct, discount_percent: discVal, mrp: calculatedMrp});
                        }
                      }} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Standard MRP (₹) *</label>
                    <input required type="number" value={currentProduct.mrp} 
                      onChange={(e) => {
                        const mrpVal = parseInt(e.target.value) || 0;
                        const disc = currentProduct.discount_percent || 0;
                        if (disc > 0) {
                          const priceVal = Math.round(mrpVal * (1 - disc / 100));
                          setCurrentProduct({...currentProduct, mrp: mrpVal, price: priceVal});
                        } else {
                          const priceVal = currentProduct.price || 0;
                          let discVal = 0;
                          if (mrpVal > 0 && priceVal < mrpVal) {
                            discVal = Math.round(((mrpVal - priceVal) / mrpVal) * 100);
                          }
                          setCurrentProduct({...currentProduct, mrp: mrpVal, discount_percent: discVal});
                        }
                      }} 
                      className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Product Image</label>
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="w-full bg-white/70 border-[#E8E2D8] border-2 border-dashed border-[#E8E2D8] hover:border-[#FF8A6B]/50 rounded-xl px-3 py-4 text-xs text-center cursor-pointer transition-colors group"
                      >
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleImageUpload(f, 'product');
                          }} 
                        />
                        {uploading ? (
                          <span className="text-[#8C1D1D] animate-pulse">⏳ Uploading...</span>
                        ) : (
                          <span className="text-[#5C544C] group-hover:text-[#8C1D1D] transition-colors">
                            <Upload size={16} className="inline mr-1.5 -mt-0.5" />Click to upload image
                          </span>
                        )}
                      </div>
                      <input 
                        value={currentProduct.image_url || ''} 
                        onChange={(e) => setCurrentProduct({...currentProduct, image_url: e.target.value})} 
                        className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2 text-[10px] focus:border-[#FF8A6B] focus:outline-none text-[#5C544C]" 
                        placeholder="Or paste image URL here..." 
                      />
                    </div>
                    {currentProduct.image_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E8E2D8] flex-shrink-0 bg-white/70 border-[#E8E2D8]">
                        <img src={currentProduct.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold">
                    <input type="checkbox" checked={currentProduct.in_stock} onChange={(e) => setCurrentProduct({...currentProduct, in_stock: e.target.checked})} className="rounded bg-white/70 border-[#E8E2D8] border-[#E8E2D8]" />
                    In Stock
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold">
                    <input type="checkbox" checked={currentProduct.is_featured} onChange={(e) => setCurrentProduct({...currentProduct, is_featured: e.target.checked})} className="rounded bg-white/70 border-[#E8E2D8] border-[#E8E2D8]" />
                    Featured item
                  </label>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#E8E2D8] mt-6">
                  <button type="button" onClick={() => setProductFormOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E8E2D8] text-[#2D241E] hover:bg-white/70 border-[#E8E2D8]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold shadow-lg">Save Crackers</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT COMBO MODAL --- */}
      <AnimatePresence>
        {comboFormOpen && currentCombo && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-0" onClick={() => setComboFormOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative z-10 w-full max-w-lg bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-3xl p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex justify-between items-center border-b border-[#E8E2D8] pb-4 mb-6">
                <h3 className="font-display font-bold text-sm text-[#8C1D1D]">{currentCombo.id ? 'Edit Combo Pack' : 'Add New Combo Pack'}</h3>
                <button onClick={() => setComboFormOpen(false)} className="p-1.5 text-[#5C544C] hover:text-[#2D241E] rounded-lg"><X size={15} /></button>
              </div>

              <form onSubmit={handleSaveCombo} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Combo Name *</label>
                    <input required value={currentCombo.combo_name} onChange={(e) => setCurrentCombo({...currentCombo, combo_name: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Combo Type (Tag)</label>
                    <input value={currentCombo.combo_type} onChange={(e) => setCurrentCombo({...currentCombo, combo_type: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" placeholder="e.g. Special Box, Kids Pack" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Total Items count *</label>
                    <input required type="number" value={currentCombo.total_items} onChange={(e) => setCurrentCombo({...currentCombo, total_items: parseInt(e.target.value) || 0})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Standard MRP (₹) *</label>
                    <input required type="number" value={currentCombo.original_price} onChange={(e) => setCurrentCombo({...currentCombo, original_price: parseInt(e.target.value) || 0})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Offer Sale Price (₹) *</label>
                    <input required type="number" value={currentCombo.offer_price} onChange={(e) => setCurrentCombo({...currentCombo, offer_price: parseInt(e.target.value) || 0})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea rows={2} value={currentCombo.description || ''} onChange={(e) => setCurrentCombo({...currentCombo, description: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Image Link URL</label>
                  <input value={currentCombo.image_url || ''} onChange={(e) => setCurrentCombo({...currentCombo, image_url: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                </div>

                <div className="flex pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold">
                    <input type="checkbox" checked={currentCombo.featured} onChange={(e) => setCurrentCombo({...currentCombo, featured: e.target.checked})} className="rounded bg-white/70 border-[#E8E2D8] border-[#E8E2D8]" />
                    Featured Combo
                  </label>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#E8E2D8] mt-6">
                  <button type="button" onClick={() => setComboFormOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E8E2D8] text-[#2D241E] hover:bg-white/70 border-[#E8E2D8]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold shadow-lg">Save Combo</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT BANK ACCOUNT MODAL --- */}
      <AnimatePresence>
        {bankFormOpen && currentBank && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-0" onClick={() => setBankFormOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-3xl p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex justify-between items-center border-b border-[#E8E2D8] pb-4 mb-6">
                <h3 className="font-display font-bold text-sm text-[#8C1D1D]">{currentBank.id ? 'Edit Bank Account' : 'Add Bank Account'}</h3>
                <button onClick={() => setBankFormOpen(false)} className="p-1.5 text-[#5C544C] hover:text-[#2D241E] rounded-lg"><X size={15} /></button>
              </div>

              <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Bank Name *</label>
                  <input required value={currentBank.bank_name} onChange={(e) => setCurrentBank({...currentBank, bank_name: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Branch Office *</label>
                    <input required value={currentBank.branch} onChange={(e) => setCurrentBank({...currentBank, branch: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Holder Name *</label>
                    <input required value={currentBank.holder_name} onChange={(e) => setCurrentBank({...currentBank, holder_name: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Account Number *</label>
                    <input required value={currentBank.account_number} onChange={(e) => setCurrentBank({...currentBank, account_number: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">IFSC Code *</label>
                    <input required value={currentBank.ifsc_code} onChange={(e) => setCurrentBank({...currentBank, ifsc_code: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">GPay Number (Optional)</label>
                    <input value={currentBank.gpay_number || ''} onChange={(e) => setCurrentBank({...currentBank, gpay_number: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">PhonePe Number (Optional)</label>
                    <input value={currentBank.phonepe_number || ''} onChange={(e) => setCurrentBank({...currentBank, phonepe_number: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#E8E2D8] mt-6">
                  <button type="button" onClick={() => setBankFormOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E8E2D8] text-[#2D241E] hover:bg-white/70 border-[#E8E2D8]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold shadow-lg">Save Bank Details</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT CATEGORY MODAL --- */}
      <AnimatePresence>
        {categoryFormOpen && currentCategory && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-0" onClick={() => setCategoryFormOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative z-10 w-full max-w-sm bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-3xl p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex justify-between items-center border-b border-[#E8E2D8] pb-4 mb-6">
                <h3 className="font-display font-bold text-sm text-[#8C1D1D]">{currentCategory.isNew ? 'Add Category' : 'Edit Category'}</h3>
                <button onClick={() => setCategoryFormOpen(false)} className="p-1.5 text-[#5C544C] hover:text-[#2D241E] rounded-lg"><X size={15} /></button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                {currentCategory.isNew && (
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Category URL Slug/ID *</label>
                    <input required value={currentCategory.id} onChange={(e) => setCurrentCategory({...currentCategory, id: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" placeholder="e.g. single-sound" />
                  </div>
                )}
                
                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Display Label Name *</label>
                  <input required value={currentCategory.label} onChange={(e) => setCurrentCategory({...currentCategory, label: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" placeholder="e.g. Single Sound" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Emoji Icon</label>
                    <input value={currentCategory.emoji} onChange={(e) => setCurrentCategory({...currentCategory, emoji: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none text-center text-lg" placeholder="💥" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Sort Order (number)</label>
                    <input type="number" value={currentCategory.sort_order} onChange={(e) => setCurrentCategory({...currentCategory, sort_order: parseInt(e.target.value) || 0})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#E8E2D8] mt-6">
                  <button type="button" onClick={() => setCategoryFormOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E8E2D8] text-[#2D241E] hover:bg-white/70 border-[#E8E2D8]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold shadow-lg">Save Category</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT HOMEPAGE SLIDER BANNER MODAL --- */}
      <AnimatePresence>
        {sliderFormOpen && currentSlider && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-0" onClick={() => setSliderFormOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-md border border-[#E8E2D8] rounded-3xl p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex justify-between items-center border-b border-[#E8E2D8] pb-4 mb-6">
                <h3 className="font-display font-bold text-sm text-[#8C1D1D]">{currentSlider.id ? 'Edit Slider Banner' : 'Add Slider Banner'}</h3>
                <button onClick={() => setSliderFormOpen(false)} className="p-1.5 text-[#5C544C] hover:text-[#2D241E] rounded-lg"><X size={15} /></button>
              </div>

              <form onSubmit={handleSaveSlider} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Banner Image Link URL</label>
                  <input value={currentSlider.image_url || ''} onChange={(e) => setCurrentSlider({...currentSlider, image_url: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" placeholder="https://domain/banner.jpg" />
                </div>
                
                <div>
                  <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Header Title (Optional)</label>
                  <input value={currentSlider.title || ''} onChange={(e) => setCurrentSlider({...currentSlider, title: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" placeholder="e.g. Grand Diwali Sale 2026" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Action redirect URL</label>
                    <input value={currentSlider.link_url || ''} onChange={(e) => setCurrentSlider({...currentSlider, link_url: e.target.value})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" placeholder="e.g. /products" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#5C544C] mb-1.5 uppercase tracking-wider">Sort Order (number)</label>
                    <input type="number" value={currentSlider.sort_order} onChange={(e) => setCurrentSlider({...currentSlider, sort_order: parseInt(e.target.value) || 0})} className="w-full bg-white/70 border-[#E8E2D8] border border-[#E8E2D8] rounded-xl px-3 py-2.5 text-xs focus:border-[#FF8A6B] focus:outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#E8E2D8] mt-6">
                  <button type="button" onClick={() => setSliderFormOpen(false)} className="flex-1 py-3 rounded-xl border border-[#E8E2D8] text-[#2D241E] hover:bg-white/70 border-[#E8E2D8]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-bold shadow-lg">Save Banner</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {successMessage && (
          <AdminSuccessToast
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirmation modal */}
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isDanger={confirmConfig.isDanger}
        onConfirm={confirmConfig.action}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

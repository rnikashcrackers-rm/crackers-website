'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      style: 'border-green-500/20 bg-[var(--surface)] text-green-500',
      icon: CheckCircle2
    },
    error: {
      style: 'border-red-500/20 bg-[var(--surface)] text-red-500',
      icon: AlertCircle
    },
    info: {
      style: 'border-[var(--color-coral)]/20 bg-[var(--surface)] text-[var(--color-coral)]',
      icon: Info
    },
  };

  const Icon = config[type].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
      animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
      exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
      className={`fixed bottom-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] ${config[type].style}`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="flex-1 font-semibold text-sm">{message}</span>
      <button
        onClick={onClose}
        className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

// Toast Manager
interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let toasts: ToastMessage[] = [];

export function useToast() {
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastId;
    toasts = [...toasts, { id, message, type }];
    toastListeners.forEach((listener) => listener(toasts));

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      toastListeners.forEach((listener) => listener(toasts));
    }, 3500);
  };

  return { addToast };
}

export function ToastContainer() {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => {
      setActiveToasts([...newToasts]);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div suppressHydrationWarning className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => {
                toasts = toasts.filter((t) => t.id !== toast.id);
                setActiveToasts([...toasts]);
                toastListeners.forEach((listener) => listener(toasts));
              }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

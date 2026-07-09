import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function calculateDiscount(price: number, mrp: number): number {
  if (!mrp || mrp === price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Format a date string or Date object consistently in IST (Indian Standard Time).
 * This ensures all PDFs, emails, and receipts show the same date regardless of
 * whether the code runs on server (UTC) or client (local timezone).
 */
export function formatOrderDate(dateInput?: string | Date | null): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

/**
 * Format a date string with time in IST for emails and detailed displays.
 */
export function formatOrderDateTime(dateInput?: string | Date | null): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}

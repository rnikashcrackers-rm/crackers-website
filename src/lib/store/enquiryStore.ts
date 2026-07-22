import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/supabase/types';

export interface EnquiryItem {
  product: Product;
  quantity: number;
}

interface EnquiryState {
  items: EnquiryItem[];
  lastActive: number | null;
  addItem: (payload: { product: Product; quantity: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSavings: () => number;
  getItemCount: () => number;
  setLastActive: (timestamp: number) => void;
  checkCartExpiry: () => void;
}

export const useEnquiryStore = create<EnquiryState>()(
  persist(
    (set, get) => ({
      items: [],
      lastActive: null,

      addItem: ({ product, quantity }) => {
        set((state) => {
          const pid = String(product.id);
          const idx = state.items.findIndex((i) => String(i.product.id) === pid);
          let updatedItems: EnquiryItem[];
          if (idx !== -1) {
            // Already in cart — increment quantity, never add a duplicate entry
            updatedItems = state.items.map((item, i) =>
              i === idx ? { ...item, quantity: item.quantity + quantity } : item
            );
          } else {
            updatedItems = [...state.items, { product, quantity }];
          }
          return {
            items: updatedItems,
            lastActive: Date.now(),
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => String(i.product.id) !== String(id)),
          lastActive: Date.now(),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            String(i.product.id) === String(id) ? { ...i, quantity: Math.min(quantity, 100) } : i
          ),
          lastActive: Date.now(),
        }));
      },

      clearCart: () => {
        set({ items: [], lastActive: null });
      },

      setLastActive: (timestamp) => {
        set({ lastActive: timestamp });
      },

      checkCartExpiry: () => {
        // Kept for interface compatibility; cart items persist without 5-minute auto-clearing
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
      },

      getSavings: () => {
        return get().items.reduce((sum, item) => sum + ((item.product.mrp || item.product.price || 0) - (item.product.price || 0)) * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'nikash-enquiry-cart',
    }
  )
);

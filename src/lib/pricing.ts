/**
 * NIKASH CRACKERS — Authoritative Pricing & Discount Engine
 * Single source of truth for financial calculations across
 * Frontend, Backend, Invoices, Admin Panel, and Emails.
 */

export interface PricingItem {
  id?: string;
  name?: string;
  price: number;
  mrp?: number;
  quantity: number;
  category?: string;
}

export interface OrderPricingSummary {
  subtotal: number;       // Gross order value (sum of selling price * qty)
  mrpTotal: number;       // Total value at standard MRP
  discountTotal: number;  // Total savings (mrpTotal - subtotal)
  discountPercent: number;// Discount percentage (e.g. 80%)
  packingCharges: number; // Standard 3% festive packing charges
  grandTotal: number;     // Final payable amount (subtotal + packingCharges)
  totalItems: number;     // Total units ordered
}

/**
 * Validates a user-supplied quantity for both stepper and manual inputs.
 * Blocks NaN, Infinity, negative values, 0, decimals, and extreme bulk quantities.
 */
export function validateQuantity(
  rawQuantity: unknown,
  maxStock: number = 9999
): { valid: boolean; quantity: number; error?: string } {
  if (rawQuantity === null || rawQuantity === undefined || rawQuantity === '') {
    return { valid: false, quantity: 1, error: 'Quantity cannot be empty' };
  }

  const num = typeof rawQuantity === 'number' ? rawQuantity : Number(String(rawQuantity).trim());

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return { valid: false, quantity: 1, error: 'Invalid numeric quantity' };
  }

  if (num <= 0) {
    return { valid: false, quantity: 1, error: 'Quantity must be at least 1' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, quantity: Math.floor(num) || 1, error: 'Quantity must be a whole number' };
  }

  if (num > maxStock) {
    return { valid: false, quantity: maxStock, error: `Quantity cannot exceed maximum stock (${maxStock})` };
  }

  return { valid: true, quantity: num };
}

/**
 * Authoritative financial calculation for order items.
 * Guaranteed consistent calculation everywhere in the system.
 */
export function calculateOrderPricing(
  items: PricingItem[],
  globalDiscountPercent: number = 80
): OrderPricingSummary {
  let subtotal = 0;
  let mrpTotal = 0;
  let totalItems = 0;

  for (const item of items) {
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (qty === 0) continue;

    const unitPrice = Math.max(0, Number(item.price) || 0);
    
    // If MRP not explicitly provided, calculate from global discount or unit price
    let mrp = Number(item.mrp) || 0;
    if (mrp <= 0) {
      if (globalDiscountPercent > 0 && globalDiscountPercent < 100) {
        mrp = Math.round(unitPrice / (1 - globalDiscountPercent / 100));
      } else {
        mrp = unitPrice;
      }
    }

    subtotal += unitPrice * qty;
    mrpTotal += mrp * qty;
    totalItems += qty;
  }

  const discountTotal = Math.max(0, mrpTotal - subtotal);
  const discountPercent = mrpTotal > 0 ? Math.round((discountTotal / mrpTotal) * 100) : 0;
  // Standard 3% packing charges on final cracker value
  const packingCharges = Math.round(subtotal * 0.03);
  const grandTotal = subtotal + packingCharges;

  return {
    subtotal,
    mrpTotal,
    discountTotal,
    discountPercent,
    packingCharges,
    grandTotal,
    totalItems,
  };
}

/**
 * Indian Rupee currency formatter
 */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * NIKASH CRACKERS — Shared Constants
 * Single source of truth for default values, valid statuses, and configuration.
 * Import from here instead of duplicating across files.
 */

// ─── ORDER STATUSES ────────────────────────────────────────────
export const VALID_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// ─── PAYMENT STATUSES ──────────────────────────────────────────
export const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'refunded'] as const;
export type PaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

// ─── DEFAULT SITE SETTINGS ────────────────────────────────────
export const DEFAULT_SETTINGS: Record<string, string> = {
  global_discount: '80',
  min_order_value: '2000',
  company_name: 'Nikash Crackers',
  company_address: 'Nikash Crackers, Sivakasi, Tamil Nadu - 626123.',
  mobile_number_1: '7867955841',
  mobile_number_2: '7867955841',
  whatsapp_number: '7867955841',
  email_address: 'rnikashcrackers@gmail.com',
  marquee:
    'Welcome to Nikash Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts! Buy More Save More!',
  whatsapp_provider: 'whatsapp_business',
  whatsapp_business_phone_number_id: '',
  whatsapp_business_access_token: '',
  whatsapp_ultramsg_instance_id: '',
  whatsapp_ultramsg_token: '',
  whatsapp_template_name: 'order_status_update',
  whatsapp_msg_pending:
    'Hello {{customer_name}}, your order {{order_number}} is received and is pending verification. We will contact you shortly to confirm!',
  whatsapp_msg_confirmed:
    'Hello {{customer_name}}, your order {{order_number}} is confirmed! We are packaging your crackers now.',
  whatsapp_msg_processing:
    'Hello {{customer_name}}, your order {{order_number}} is being processed at our Sivakasi factory.',
  whatsapp_msg_shipped:
    'Hello {{customer_name}}, your order {{order_number}} has been shipped! Transport tracking details: {{tracking_info}}',
  whatsapp_msg_delivered:
    'Hello {{customer_name}}, your order {{order_number}} has been successfully delivered. Happy and safe celebrating! 🎆',
  whatsapp_msg_cancelled:
    'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you have questions.',
};

// ─── PACKING CHARGES ───────────────────────────────────────────
/** Standard packing charges rate (3%) applied on order subtotal */
export const PACKING_CHARGES_RATE = 0.03;

// ─── CART CONFIGURATION ────────────────────────────────────────
/** Cart expiry in milliseconds (60 minutes) */
export const CART_EXPIRY_MS = 60 * 60 * 1000;

// ─── ADMIN SESSION ─────────────────────────────────────────────
/** Admin session duration in milliseconds (8 hours) */
export const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

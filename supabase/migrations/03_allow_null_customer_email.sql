-- ==============================================================================
-- NIKASH CRACKERS: Migration 03 — Relax NOT NULL Constraints for Optional Checkout
-- ==============================================================================

-- 1. Ensure customer_email is optional (DROP NOT NULL)
ALTER TABLE IF EXISTS public.orders 
  ALTER COLUMN customer_email DROP NOT NULL;

-- 2. Ensure regional location fields are also optional
ALTER TABLE IF EXISTS public.orders 
  ALTER COLUMN customer_city DROP NOT NULL;

ALTER TABLE IF EXISTS public.orders 
  ALTER COLUMN customer_pincode DROP NOT NULL;

ALTER TABLE IF EXISTS public.orders 
  ALTER COLUMN customer_state DROP NOT NULL;

ALTER TABLE IF EXISTS public.orders 
  ALTER COLUMN customer_district DROP NOT NULL;

-- 3. Verify public table column types
COMMENT ON COLUMN public.orders.customer_email IS 'Optional customer email for order confirmations and receipts';

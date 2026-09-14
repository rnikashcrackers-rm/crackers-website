-- ====================================================================
-- NIKASH CRACKERS: Migration 04 — Admin Write Policies & Data Fixes
-- Adds INSERT/UPDATE/DELETE policies for service_role on admin-managed tables.
-- Adds unique constraint on orders.order_number.
-- Adds missing columns to orders table.
-- ====================================================================

-- 1. ADD WRITE POLICIES FOR SERVICE_ROLE ON ADMIN-MANAGED TABLES
-- These policies allow the service_role (used by admin API routes) to 
-- perform full CRUD operations. The anon role remains read-only.

-- Products: service_role can INSERT, UPDATE, DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Service Role Full Access Products') THEN
    CREATE POLICY "Service Role Full Access Products"
    ON public.products FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Categories: service_role can INSERT, UPDATE, DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Service Role Full Access Categories') THEN
    CREATE POLICY "Service Role Full Access Categories"
    ON public.categories FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Site Settings: service_role can INSERT, UPDATE, DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Service Role Full Access Settings') THEN
    CREATE POLICY "Service Role Full Access Settings"
    ON public.site_settings FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Bank Accounts: service_role can INSERT, UPDATE, DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bank_accounts' AND policyname = 'Service Role Full Access Bank Accounts') THEN
    CREATE POLICY "Service Role Full Access Bank Accounts"
    ON public.bank_accounts FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Combo Packs: service_role can INSERT, UPDATE, DELETE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'combo_packs' AND policyname = 'Service Role Full Access Combo Packs') THEN
    CREATE POLICY "Service Role Full Access Combo Packs"
    ON public.combo_packs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Sliders: service_role can INSERT, UPDATE, DELETE (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sliders') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sliders' AND policyname = 'Service Role Full Access Sliders') THEN
      EXECUTE 'CREATE POLICY "Service Role Full Access Sliders" ON public.sliders FOR ALL TO service_role USING (true) WITH CHECK (true);';
    END IF;
  END IF;
END $$;

-- Orders: service_role can UPDATE, DELETE (for admin order management)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'Service Role Full Access Orders') THEN
    CREATE POLICY "Service Role Full Access Orders"
    ON public.orders FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Order Items: service_role full access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Service Role Full Access Order Items') THEN
    CREATE POLICY "Service Role Full Access Order Items"
    ON public.order_items FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Enquiries: service_role can SELECT (for admin dashboard reads)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'enquiries' AND policyname = 'Service Role Full Access Enquiries') THEN
    CREATE POLICY "Service Role Full Access Enquiries"
    ON public.enquiries FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Contact Messages: service_role full access (for admin reads, mark as read)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Service Role Full Access Contact Messages') THEN
    CREATE POLICY "Service Role Full Access Contact Messages"
    ON public.contact_messages FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Newsletter Subscribers: service_role full access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers' AND policyname = 'Service Role Full Access Newsletter') THEN
    CREATE POLICY "Service Role Full Access Newsletter"
    ON public.newsletter_subscribers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- Error Logs: service_role full access (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'error_logs') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'error_logs' AND policyname = 'Service Role Full Access Error Logs') THEN
      EXECUTE 'CREATE POLICY "Service Role Full Access Error Logs" ON public.error_logs FOR ALL TO service_role USING (true) WITH CHECK (true);';
    END IF;
  END IF;
END $$;

-- Analytics Events: service_role full access (if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'analytics_events') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'analytics_events' AND policyname = 'Service Role Full Access Analytics') THEN
      EXECUTE 'CREATE POLICY "Service Role Full Access Analytics" ON public.analytics_events FOR ALL TO service_role USING (true) WITH CHECK (true);';
    END IF;
  END IF;
END $$;


-- 2. ADD UNIQUE CONSTRAINT ON ORDER NUMBER
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.orders'::regclass 
    AND conname = 'orders_order_number_unique'
  ) THEN
    ALTER TABLE public.orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
  END IF;
END $$;


-- 3. ADD MISSING COLUMNS TO ORDERS TABLE
ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS customer_state TEXT;

ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS customer_district TEXT;


-- 4. ADD INDEX ON ORDERS FOR FASTER LOOKUPS
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);


-- 5. ADD PUBLIC-FACING (ANON) POLICIES FOR TABLES FLAGGED BY LINTER
-- These resolve "RLS Enabled No Policy" warnings for external-facing tables.

-- Sliders: public can SELECT (homepage slider images are public content)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sliders') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sliders' AND policyname = 'Public Read Sliders') THEN
      EXECUTE 'CREATE POLICY "Public Read Sliders" ON public.sliders FOR SELECT TO anon, authenticated USING (true);';
    END IF;
  END IF;
END $$;

-- Error Logs: anon can INSERT (client-side error tracking writes)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'error_logs') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'error_logs' AND policyname = 'Anon Insert Error Logs') THEN
      EXECUTE 'CREATE POLICY "Anon Insert Error Logs" ON public.error_logs FOR INSERT TO anon, authenticated WITH CHECK (true);';
    END IF;
  END IF;
END $$;

-- Analytics Events: anon can INSERT (frontend analytics tracking)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'analytics_events') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'analytics_events' AND policyname = 'Anon Insert Analytics Events') THEN
      EXECUTE 'CREATE POLICY "Anon Insert Analytics Events" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);';
    END IF;
  END IF;
END $$;

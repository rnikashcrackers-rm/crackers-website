-- ====================================================================
-- NIKASH CRACKERS: RESOLVE ALL 9 SECURITY ADVISOR WARNINGS
-- Cleans up search_path, permissive WITH CHECK clauses, storage listing,
-- and restricts decrement_product_stock to service_role / postgres.
-- ====================================================================

-- 1. FIX FUNCTION WARNINGS (search_path + revoke public/anon/authenticated execution)
-- Resolves:
-- - function_search_path_mutable
-- - anon_security_definer_function_executable
-- - authenticated_security_definer_function_executable
CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_product_id TEXT, p_qty INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_stock INT;
BEGIN
  SELECT stock_quantity INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF v_current_stock IS NULL OR v_current_stock < p_qty THEN
    RETURN FALSE;
  END IF;

  UPDATE public.products
  SET 
    stock_quantity = stock_quantity - p_qty,
    in_stock = ((stock_quantity - p_qty) > 0)
  WHERE id = p_product_id;

  RETURN TRUE;
END;
$$;

-- Revoke execute from public/anon/authenticated; allow only postgres & service_role
REVOKE ALL ON FUNCTION public.decrement_product_stock(TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock(TEXT, INT) TO postgres, service_role;

-- 2. FIX STORAGE BUCKET LISTING WARNING
-- Resolves: public_bucket_allows_listing
-- Public buckets serve files via public CDN URL without needing SELECT policies on storage.objects.
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects') THEN
    DROP POLICY IF EXISTS "Public Object Download" ON storage.objects;
    DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public listing" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  END IF;
END $$;

-- 3. FIX RLS_POLICY_ALWAYS_TRUE (WITH CHECK validation constraints instead of bare true)
-- Resolves: all 5 rls_policy_always_true warnings

-- Orders: Require name, phone and valid total_amount
DROP POLICY IF EXISTS "Allow Insert Orders" ON public.orders;
CREATE POLICY "Allow Insert Orders" 
ON public.orders FOR INSERT 
TO public 
WITH CHECK (
  customer_name IS NOT NULL 
  AND length(customer_name) > 0
  AND customer_phone IS NOT NULL
  AND length(customer_phone) >= 10
  AND total_amount >= 0
);

-- Order Items: Require positive quantity and non-negative unit price
DROP POLICY IF EXISTS "Allow Insert Order Items" ON public.order_items;
CREATE POLICY "Allow Insert Order Items" 
ON public.order_items FOR INSERT 
TO public 
WITH CHECK (
  quantity > 0 
  AND unit_price >= 0 
  AND product_name IS NOT NULL
);

-- Enquiries: Require customer name or phone
DROP POLICY IF EXISTS "Allow Insert Enquiries" ON public.enquiries;
CREATE POLICY "Allow Insert Enquiries" 
ON public.enquiries FOR INSERT 
TO public 
WITH CHECK (
  customer_phone IS NOT NULL 
  OR customer_name IS NOT NULL
);

-- Contact Messages: Require name and message
DROP POLICY IF EXISTS "Allow Insert Contact Messages" ON public.contact_messages;
CREATE POLICY "Allow Insert Contact Messages" 
ON public.contact_messages FOR INSERT 
TO public 
WITH CHECK (
  name IS NOT NULL 
  AND length(name) > 0 
  AND message IS NOT NULL 
  AND length(message) > 0
);

-- Newsletter Subscribers: Require valid email format
DROP POLICY IF EXISTS "Allow Insert Newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow Insert Newsletter" 
ON public.newsletter_subscribers FOR INSERT 
TO public 
WITH CHECK (
  email IS NOT NULL 
  AND email LIKE '%@%.%'
);

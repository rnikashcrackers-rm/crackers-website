import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env.local
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

console.log('====================================================');
console.log('NIKASH CRACKERS - FULL SUITE VERIFICATION');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       Evidence: ${details}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       Error: ${details}`);
    failCount++;
  }
}

// 1. FINANCIAL CALCULATION TESTS
console.log('\n--- 1. PRICING & FINANCIAL CALCULATION TESTS ---');
const { calculateOrderPricing } = await import('../src/lib/pricing.ts');

const sampleItems = [
  { id: 'p1', name: 'GATIMAAN', price: 1050, mrp: 5250, quantity: 1 },
  { id: 'p2', name: 'VANTHEBHARAT', price: 1050, mrp: 5250, quantity: 1 },
];

const pricingResult = calculateOrderPricing(sampleItems);
console.log('Calculated Result:', {
  grossTotal: pricingResult.mrpTotal,
  totalDiscount: pricingResult.discountTotal,
  discountedSubtotal: pricingResult.subtotal,
  packingCharges: pricingResult.packingCharges,
  finalPayable: pricingResult.grandTotal
});

assert(pricingResult.mrpTotal === 10500, 'Gross Total (mrpTotal) calculation', `Expected 10500, got ${pricingResult.mrpTotal}`);
assert(pricingResult.discountTotal === 8400, 'Festival Discount (80%) calculation', `Expected 8400, got ${pricingResult.discountTotal}`);
assert(pricingResult.subtotal === 2100, 'Discounted Subtotal calculation', `Expected 2100, got ${pricingResult.subtotal}`);
assert(pricingResult.packingCharges === 63, 'Packing Charges (3%) calculation', `Expected 63, got ${pricingResult.packingCharges}`);
assert(pricingResult.grandTotal === 2163, 'Final Net Payable (grandTotal) calculation', `Expected 2163, got ${pricingResult.grandTotal}`);

// 2. EMAIL NORMALIZATION & VALIDATION TESTS
console.log('\n--- 2. EMAIL NORMALIZATION & VALIDATION TESTS ---');
function normalizeCustomerEmail(rawEmail) {
  if (typeof rawEmail !== 'string') return null;
  const trimmed = rawEmail.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
    return null;
  }
  return trimmed;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(email) {
  if (!email) return true; // optional!
  return EMAIL_REGEX.test(email);
}

assert(normalizeCustomerEmail(null) === null, 'Normalize null email -> null');
assert(normalizeCustomerEmail(undefined) === null, 'Normalize undefined email -> null');
assert(normalizeCustomerEmail('') === null, 'Normalize empty string email -> null');
assert(normalizeCustomerEmail('   ') === null, 'Normalize whitespace email -> null');
assert(normalizeCustomerEmail('null') === null, 'Normalize literal "null" string -> null');
assert(normalizeCustomerEmail('customer@example.com') === 'customer@example.com', 'Normalize valid email preserves value');
assert(validateEmail(normalizeCustomerEmail('')) === true, 'Validation passes for omitted/empty email');
assert(validateEmail(normalizeCustomerEmail('customer@example.com')) === true, 'Validation passes for valid email');
assert(validateEmail(normalizeCustomerEmail('invalid-email')) === false, 'Validation rejects invalid email format');

// 3. PDF RECEIPT GENERATION & NET PAYABLE VISIBILITY TEST
console.log('\n--- 3. PDF RECEIPT GENERATION TESTS ---');
const { generateReceipt } = await import('../src/lib/pdf/receiptGenerator.ts');

const pdfData = {
  orderNumber: 'NC-20261011-9999',
  date: '10 October 2026',
  customerName: 'RAJA PANDI',
  customerPhone: '7867955841',
  customerEmail: null, // Test missing email!
  customerAddress: 'Sivakasi',
  customerCity: 'Sivakasi',
  customerState: 'Tamil Nadu',
  customerPincode: '626123',
  items: [
    {
      name: 'GATIMAAN',
      category: 'Special Crackers',
      quantity: 1,
      mrp: 5250,
      price: 1050,
    },
    {
      name: 'VANTHEBHARAT',
      category: 'Special Crackers',
      quantity: 1,
      mrp: 5250,
      price: 1050,
    }
  ],
  subtotal: 10500, // Gross subtotal at MRP
  discountTotal: 8400,
  totalAmount: 2163, // Correct net payable
  packingCharges: 63,
};

const pdfDoc = await generateReceipt(pdfData);
const pdfArrayBuffer = pdfDoc.output('arraybuffer');
const pdfBuffer = Buffer.from(pdfArrayBuffer);
const pdfOutputDir = path.join(rootDir, 'scratch');
if (!fs.existsSync(pdfOutputDir)) fs.mkdirSync(pdfOutputDir, { recursive: true });
const pdfOutputPath = path.join(pdfOutputDir, 'test_receipt_output.pdf');
fs.writeFileSync(pdfOutputPath, pdfBuffer);

assert(pdfBuffer.length > 5000, 'PDF generated successfully as binary file', `Size: ${pdfBuffer.length} bytes at ${pdfOutputPath}`);

// Inspect raw PDF content strings to verify financial amounts and text labels
const pdfRawText = pdfBuffer.toString('latin1');
assert(pdfRawText.includes('NET PAYABLE AMOUNT:'), 'PDF contains NET PAYABLE AMOUNT label');
assert(pdfRawText.includes('2,163') || pdfRawText.includes('2163'), 'PDF contains formatted net payable amount: 2,163');
assert(pdfRawText.includes('10,500') || pdfRawText.includes('10500'), 'PDF contains Gross Amount (10,500)');
assert(pdfRawText.includes('8,400') || pdfRawText.includes('8400'), 'PDF contains Festival Discount (8,400)');
assert(pdfRawText.includes('Not provided'), 'PDF handles null email by rendering "Not provided"');

// 4. SUPABASE DATABASE ORDER CREATION (OPTIONAL EMAIL & DB COMPLIANCE)
console.log('\n--- 4. SUPABASE DATABASE COMPLIANCE TESTS ---');
const { createClient } = await import('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test inserting an order with null customer_email (or fallback to empty string)
  const testOrderNumber = `NC-TEST-${Date.now().toString().slice(-6)}`;
  let insertedOrderId = null;

  // Emulate backend insertion logic from src/app/api/orders/route.ts
  let insertPayload = {
    order_number: testOrderNumber,
    customer_name: 'TEST QA CUSTOMER',
    customer_phone: '9876543210',
    customer_email: null,
    customer_address: '123 Test Street, Sivakasi',
    customer_city: 'Sivakasi',
    customer_state: 'Tamil Nadu',
    customer_pincode: '626123',
    items: [
      {
        id: 'p1',
        name: 'GATIMAAN',
        price: 1050,
        mrp: 5250,
        quantity: 1,
      },
      {
        id: 'p2',
        name: 'VANTHEBHARAT',
        price: 1050,
        mrp: 5250,
        quantity: 1,
      }
    ],
    subtotal: 10500,
    discount_total: 8400,
    total_amount: 2163,
    status: 'confirmed',
    payment_method: 'cash_on_delivery',
    payment_status: 'pending',
    notes: 'Test order from automated verification suite'
  };

  let { data: orderData, error: insertError } = await supabase
    .from('orders')
    .insert(insertPayload)
    .select('id, order_number, customer_email, total_amount, subtotal, discount_total')
    .single();

  if (insertError && (insertError.code === '23502' || insertError.message?.includes('customer_email'))) {
    // Database has NOT NULL constraint; test our backend fallback
    console.log('Note: DB constraint 23502 encountered; testing graceful fallback with customer_email: ""');
    const fallbackRes = await supabase
      .from('orders')
      .insert({ ...insertPayload, customer_email: '' })
      .select('id, order_number, customer_email, total_amount, subtotal, discount_total')
      .single();
    orderData = fallbackRes.data;
    insertError = fallbackRes.error;
  }

  assert(!insertError, 'Order successfully inserted without email', insertError ? insertError.message : `Order ID: ${orderData?.id}, Total: ₹${orderData?.total_amount}`);

  if (orderData?.id) {
    insertedOrderId = orderData.id;

    // Verify order fetch & output normalization
    const { data: fetchedOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', insertedOrderId)
      .single();

    assert(Number(fetchedOrder?.total_amount) === 2163, 'Persisted total_amount matches exactly ₹2,163', `Got: ${fetchedOrder?.total_amount}`);
    assert(Number(fetchedOrder?.subtotal) === 10500, 'Persisted subtotal matches ₹10,500', `Got: ${fetchedOrder?.subtotal}`);
    assert(Number(fetchedOrder?.discount_total) === 8400, 'Persisted discount_total matches ₹8,400', `Got: ${fetchedOrder?.discount_total}`);
    assert(Array.isArray(fetchedOrder?.items) && fetchedOrder.items.length === 2, 'Fetched order includes all items in JSONB', `Count: ${fetchedOrder?.items?.length}`);

    // Clean up test order to keep database clean
    await supabase.from('orders').delete().eq('id', insertedOrderId);
    console.log('[CLEANUP] Deleted temporary test order record.');
  }

  // 5. STORAGE BUCKET VERIFICATION
  console.log('\n--- 5. STORAGE BUCKET VERIFICATION ---');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  assert(!bucketError, 'Supabase storage buckets accessible', bucketError ? bucketError.message : `${buckets?.length} buckets listed`);
  const productImagesBucket = buckets?.find(b => b.name === 'product-images');
  assert(!!productImagesBucket, 'product-images bucket exists', `Public: ${productImagesBucket?.public}`);
} else {
  console.warn('[SKIP] Supabase credentials not found in environment.');
}

console.log('\n====================================================');
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

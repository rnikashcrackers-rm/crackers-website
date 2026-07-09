import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    envVars[key] = val.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Anon Key not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse products.ts
const productsTsPath = path.resolve('src/lib/data/products.ts');
const productsTsContent = fs.readFileSync(productsTsPath, 'utf8');

// Use a regex or parse the content to get the array
const arrayMatch = productsTsContent.match(/export\s+const\s+products:\s+Product\[\]\s*=\s*([\s\S]*?);/);
if (!arrayMatch) {
  console.error('Error: Could not find products array in products.ts');
  process.exit(1);
}

let productsArrayStr = arrayMatch[1].trim();

// Parse using eval (safe since products.ts is static local code)
let products = [];
try {
  // Use a Function constructor to safely evaluate the array in a clean scope
  products = new Function(`return ${productsArrayStr}`)();
} catch (e) {
  console.error('Error compiling products array:', e);
  process.exit(1);
}

console.log(`Found ${products.length} products in products.ts. Seeding to Supabase...`);

async function seed() {
  // Clear existing products first
  console.log('Clearing existing products from Supabase...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '0');
  if (deleteError) {
    console.error('Error clearing products:', deleteError);
  }

  // Insert products in chunks
  const chunkSize = 50;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize).map(p => {
      // Map to db schema fields
      return {
        id: String(p.id),
        name_en: p.name_en,
        name_ta: p.name_ta || p.name_en,
        slug: p.slug,
        category: p.category,
        price: Number(p.price),
        mrp: Number(p.mrp),
        discount_percent: Number(p.discount_percent || 0),
        badge_text: p.badge_text,
        image_url: p.image_url,
        images: p.images || [],
        description_en: p.description_en || '',
        description_ta: p.description_ta || '',
        in_stock: p.in_stock !== false,
        is_featured: p.is_featured === true,
        is_eco_friendly: p.is_eco_friendly === true,
        sort_order: Number(p.sort_order || 0)
      };
    });

    console.log(`Inserting chunk ${i / chunkSize + 1} of ${Math.ceil(products.length / chunkSize)}...`);
    const { error } = await supabase.from('products').insert(chunk);
    if (error) {
      console.error(`Error inserting chunk starting at index ${i}:`, error);
      process.exit(1);
    }
  }

  console.log('Successfully seeded all products!');
}

seed();

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

const defaultCombos = [
  {
    combo_name: "Family Pack Deluxe",
    total_items: 25,
    original_price: 2500,
    offer_price: 500,
    combo_type: "family",
    description: "Perfect fireworks package for the whole family, including sparklers, flowerpots, chakkars, and sound crackers.",
    image_url: "/product-assets/giftbox.jpg",
    products: [
      { id: "1", name: "2 3/4 Kuruvi", quantity: 5 },
      { id: "10", name: "10\" Sparklers", quantity: 5 },
      { id: "15", name: "Big Chakkars", quantity: 5 },
      { id: "20", name: "Flower Pots Big", quantity: 5 },
      { id: "25", name: "Baby Rockets", quantity: 5 }
    ],
    featured: true
  },
  {
    combo_name: "Kids Special Gift Box",
    total_items: 15,
    original_price: 1200,
    offer_price: 250,
    combo_type: "kids",
    description: "Safe and colorful sparklers, flowerpots, and novelties designed especially for children.",
    image_url: "/product-assets/giftbox.jpg",
    products: [
      { id: "10", name: "10\" Sparklers", quantity: 5 },
      { id: "15", name: "Big Chakkars", quantity: 5 },
      { id: "20", name: "Flower Pots Big", quantity: 5 }
    ],
    featured: true
  }
];

async function seed() {
  console.log('Clearing existing combo packs from Supabase...');
  const { error: deleteError } = await supabase.from('combo_packs').delete().neq('id', '0');
  if (deleteError) {
    console.error('Error clearing combo packs:', deleteError);
  }

  console.log('Seeding default combo packs...');
  const { error } = await supabase.from('combo_packs').insert(defaultCombos);
  if (error) {
    console.error('Error seeding combo packs:', error);
    process.exit(1);
  }

  console.log('Successfully seeded combo packs!');
}

seed();

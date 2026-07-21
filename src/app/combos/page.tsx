'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Sparkles, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useEnquiryStore } from '@/lib/store/enquiryStore';
import { DeepamFlameIcon } from '@/components/ui/TraditionalDeepamGarland';

const comboPackages = [
  {
    id: 'combo-50-item-mega',
    name: '50 ITEM Mega Family Delight Pack',
    name_ta: '50 பொருட்கள் மெகா ஃபேமிலி பேக்',
    price: 4999,
    mrp: 22500,
    itemsCount: 50,
    badge: 'Best Seller',
    image: '/hero_gift_box.png',
    description: 'The ultimate luxury Diwali celebration box packed with sparklers, flower pots, ground chakkars, rockets, and 12-shot aerial repeaters for the entire family!',
    contents: [
      '10 Cm Electric Sparklers (2 Boxes)',
      '15 Cm Color Sparklers (2 Boxes)',
      '30 Cm Deluxe Sparklers (1 Box)',
      'Flower Pots Big & Special (4 Boxes)',
      'Ground Chakkars Deluxe (3 Boxes)',
      'Twinkling Stars 1.5 Foot (2 Boxes)',
      '12 Shot Aerial Repeater (1 Box)',
      'Hydro Bomb & Bullet Crackers (3 Boxes)',
      'Sound Rockets & Color Rockets (2 Boxes)',
      'Fancy Whistling & Fountain Crackers (3 Boxes)',
      'Kids Pop-Pop & Serpent Eggs (5 Boxes)'
    ]
  },
  {
    id: 'combo-41-item-grand',
    name: '41 ITEM Grand Celebration Box',
    name_ta: '41 பொருட்கள் கிராண்ட் கொண்டாட்ட பேக்',
    price: 3499,
    mrp: 15500,
    itemsCount: 41,
    badge: 'Popular',
    image: '/product-assets/sparklers_brand.png',
    description: 'Perfect balanced family package featuring top-rated sparkling fountains, colorful ground spinners, and festive aerial displays.',
    contents: [
      '10 Cm Electric Sparklers (2 Boxes)',
      '15 Cm Green Sparklers (1 Box)',
      'Flower Pots Special (3 Boxes)',
      'Ground Chakkars Special (2 Boxes)',
      'Twinkling Stars (2 Boxes)',
      '7 Shot Sky Display (1 Box)',
      'Atom Bomb & Lakshmi Crackers (3 Boxes)',
      'Color Rockets (1 Box)',
      'Kids Special Magic Pops & Matches (4 Boxes)'
    ]
  },
  {
    id: 'combo-31-item-kids',
    name: '31 ITEM Kids Sparkler & Fun Pack',
    name_ta: '31 பொருட்கள் குழந்தைகள் ஃபேவரிட் பேக்',
    price: 2499,
    mrp: 10800,
    itemsCount: 31,
    badge: 'Kids Special',
    image: '/product-assets/flower_pots_brand.png',
    description: 'Safe, low-noise eco-friendly green crackers pack curated specially for young children with sparkling sticks and colorful fountains.',
    contents: [
      '10 Cm Color Sparklers (3 Boxes)',
      '15 Cm Electric Sparklers (2 Boxes)',
      'Flower Pots Small & Medium (3 Boxes)',
      'Ground Chakkars Small (2 Boxes)',
      'Pencil Fountains (2 Boxes)',
      'Magic Snake Eggs (3 Boxes)',
      'Pop Pop Crackers (4 Boxes)'
    ]
  },
  {
    id: 'combo-25-item-sky',
    name: '25 ITEM Sky Display & Rocket Special',
    name_ta: '25 பொருட்கள் ஆகாய வானவேடிக்கை பேக்',
    price: 2999,
    mrp: 12500,
    itemsCount: 25,
    badge: 'Sky Show',
    image: '/product-assets/aerial_shots_brand.png',
    description: 'Dazzling aerial showpack with multi-shot repeaters, whistle rockets, colorful parachutes, and high-altitude sky bursts.',
    contents: [
      '12 Shot Multi-Color Sky Repeater (1 Box)',
      '7 Shot Aerial Burst (2 Boxes)',
      'Sound & Light Rockets (2 Boxes)',
      'Whistling Sky Rockets (1 Box)',
      'Color Flower Pots Special (3 Boxes)',
      'Deluxe Ground Chakkars (2 Boxes)'
    ]
  },
  {
    id: 'combo-21-item-mini',
    name: '21 ITEM Mini Budget Family Box',
    name_ta: '21 பொருட்கள் பட்ஜெட் குடும்ப பேக்',
    price: 1999,
    mrp: 8500,
    itemsCount: 21,
    badge: 'Budget Choice',
    image: '/hero_gift_box.png',
    description: 'Affordable Nikash Crackers box with all essential sparklers, chakkars, and flower pots at direct wholesale prices.',
    contents: [
      '10 Cm Sparklers (2 Boxes)',
      'Flower Pots Medium (2 Boxes)',
      'Ground Chakkars (2 Boxes)',
      'Twinkling Stars (1 Box)',
      'Garland Crackers 100s (2 Boxes)',
      'Kids Special Matches (2 Boxes)'
    ]
  }
];

export default function CombosPage() {
  const addItem = useEnquiryStore((state) => state.addItem);
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  const handleAddCombo = (combo: typeof comboPackages[0]) => {
    addItem({
      product: {
        id: combo.id,
        name_en: combo.name,
        name_ta: combo.name_ta,
        slug: combo.id,
        category: 'Gift Boxes',
        price: combo.price,
        mrp: combo.mrp,
        discount_percent: Math.round(((combo.mrp - combo.price) / combo.mrp) * 100),
        badge_text: combo.badge,
        image_url: combo.image,
        images: [],
        description_en: combo.description,
        description_ta: null,
        in_stock: true,
        is_featured: true,
        is_eco_friendly: true,
        sort_order: 0,
        created_at: new Date().toISOString()
      },
      quantity: 1
    });

    setAddedComboId(combo.id);
    setTimeout(() => setAddedComboId(null), 2500);
  };

  return (
    <div className="bg-[#0B132B] text-white min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F7B733]/40 bg-[#101A36] text-[#F7B733] text-xs font-black uppercase tracking-widest">
          <DeepamFlameIcon className="w-5 h-5" /> NIKASH CRACKERS COMBO BOXES
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white">
          Festive Crackers <span className="text-[#F7B733]">Combo Packages</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
          Save up to 78% with curated Nikash Crackers celebration boxes. Each box is packed with CSIR green certified fireworks delivered directly to your town.
        </p>
      </div>

      {/* Combo Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {comboPackages.map((combo) => {
          const discountPercent = Math.round(((combo.mrp - combo.price) / combo.mrp) * 100);
          const isAdded = addedComboId === combo.id;

          return (
            <motion.div
              key={combo.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#101A36]/90 backdrop-blur-md border border-[#F7B733]/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Row: Badge & Discount */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#F7B733] text-[#101A36] text-xs font-black uppercase tracking-wider">
                  {combo.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#D95136] text-white text-xs font-black uppercase tracking-wider shadow-md">
                  🔥 {discountPercent}% OFF
                </span>
              </div>

              {/* Title & Tamil Name */}
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  {combo.name}
                </h2>
                <p className="text-xs text-[#F7B733] font-bold mt-0.5">{combo.name_ta}</p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">{combo.description}</p>
              </div>

              {/* Price & Savings Box */}
              <div className="bg-[#0B132B]/80 border border-[#172448] rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#F7B733]">
                    ₹{combo.price.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-2 text-xs text-slate-400 line-through">
                    ₹{combo.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold block">
                    You Save ₹{(combo.mrp - combo.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">Includes wholesale discount</span>
                </div>
              </div>

              {/* Box Contents Breakdown */}
              <div className="mb-6 space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F7B733] flex items-center gap-2">
                  <Gift size={14} /> Included in Box ({combo.itemsCount} Items):
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-200">
                  {combo.contents.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check size={12} className="text-[#F7B733] shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Action */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#172448]">
                <button
                  onClick={() => handleAddCombo(combo)}
                  className={`flex-1 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg min-h-[48px] ${
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#F7B733] text-[#101A36] hover:bg-[#FFD05C] active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add Combo to Cart
                    </>
                  )}
                </button>
                <Link
                  href="/enquiry"
                  className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors min-h-[48px]"
                >
                  View Cart <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Guarantee Bottom Bar */}
      <div className="mt-16 bg-[#101A36]/80 border border-[#172448] rounded-2xl p-6 text-center flex flex-col sm:flex-row items-center justify-around gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} className="text-[#F7B733]" />
          <div className="text-left">
            <p className="text-xs font-black text-white uppercase">CSIR Eco Green Certified</p>
            <p className="text-[10px] text-slate-400">100% Genuine Nikash Crackers factory products</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sparkles size={28} className="text-[#F7B733]" />
          <div className="text-left">
            <p className="text-xs font-black text-white uppercase">Direct Factory Freight</p>
            <p className="text-[10px] text-slate-400">Damage-proof transport box packing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

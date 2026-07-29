import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Factory,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  PackageCheck,
  Headphones,
} from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { DeepamFlameIcon } from '@/components/ui/TraditionalDeepamGarland';
import { MarqueeBanner } from '@/components/layout/MarqueeBanner';

const categories = [
  {
    title: 'Gift Boxes',
    subtitle: 'Ready-made family celebration boxes',
    image: '/hero_gift_box.png',
    href: '/products?category=gift-box-no-discound',
    badge: 'Popular',
    count: '4 Packs'
  },
  {
    title: 'Electric Sparklers',
    subtitle: 'Classic metallic, color & electric sparklers',
    image: '/product-assets/sparklers_brand.png',
    href: '/products?category=electric-sparklers',
    badge: 'Traditional',
    count: '25 Varieties'
  },
  {
    title: 'Flower Pots',
    subtitle: 'Golden & multicolor ground fountains',
    image: '/product-assets/flower_pots_brand.png',
    href: '/products?category=flower-pots',
    badge: 'Festive',
    count: '6 Sizes'
  },
  {
    title: 'Multi-Colour Shots',
    subtitle: 'Sky fireworks & repeater shots',
    image: '/product-assets/aerial_shots_brand.png',
    href: '/products?category=multi-colour-shots-with-crackling',
    badge: 'Sky Display',
    count: '10 Shots'
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const discount = settings.global_discount || '60';

  return (
    <div className="bg-[#0B132B] text-white min-h-screen overflow-x-hidden relative">
      {/* Background Traditional Tamil Kolam Decorations */}
      <div className="absolute top-10 left-4 pointer-events-none opacity-20 z-0 hidden md:block">
        <AnimatedKolam size={260} color="#F7B733" />
      </div>
      <div className="absolute top-1/2 right-4 pointer-events-none opacity-20 z-0 hidden md:block">
        <AnimatedKolam size={300} color="#F7B733" delay={0.5} />
      </div>

      {/* FULL-PAGE HERO WITH UPLOADED NIKASH BANNER & BLUE + GOLD GLASSMORPHISM */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-10 md:py-16 border-b border-[#172448] overflow-hidden">
        {/* Full Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/nikash-hero-banner.jpg"
            alt="Nikash Crackers Luxury Hero Banner Display"
            fill
            priority
            className="object-cover object-right md:object-center opacity-45 scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/80 to-[#0B132B]/50" />
        </div>

        {/* Hero Glassmorphism Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Left Glassmorphism Box */}
            <div className="bg-[#101A36]/85 backdrop-blur-md border border-[#F7B733]/40 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl space-y-5 relative overflow-hidden">
              {/* Corner Deepams */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <DeepamFlameIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#F7B733]/60 bg-[#0B132B]/80 px-3.5 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#F7B733]">
                <Sparkles size={14} className="shrink-0 text-[#F7B733]" /> NIKASH CRACKERS — SIVAKASI
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                Make every night <span className="text-[#F7B733]">shine brighter.</span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                Nikash Crackers — premium fireworks delivered straight from our Sivakasi manufacturing hub. Select from eco-certified green crackers, build your order enquiry, and get direct factory pricing with up to {discount}% savings.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F7B733] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-[#101A36] transition hover:bg-[#FFD05C] active:scale-95 shadow-lg min-h-[48px]"
                >
                  Buy Now <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-white/20 min-h-[48px] backdrop-blur-sm"
                >
                  <PhoneCall size={16} /> Order Support
                </Link>
              </div>

              {/* Trust Highlights Grid */}
              <div className="grid grid-cols-3 gap-3 border-t border-[#172448] pt-5 text-left">
                <div>
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F7B733]">Direct Dispatch</p>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-300">Sivakasi Hub</p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F7B733]">Eco Friendly</p>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-300">Green Crackers</p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F7B733]">Pan-India</p>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-300">Fast Shipping</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-[#F7B733]/50 bg-[#101A36]/85 backdrop-blur-md shadow-2xl p-3">
                <div className="aspect-[16/10] sm:aspect-[4/3] relative w-full rounded-2xl overflow-hidden border border-[#172448]">
                  <Image
                    src="/images/nikash-hero-banner.jpg"
                    alt="Nikash Crackers — Premium Fireworks Luxury Box Display"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#0B132B]/90 backdrop-blur-md border border-[#F7B733]/40 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#F7B733]">
                    ⚡ NIKASH CRACKERS
                  </div>
                </div>

                <div className="p-3 pt-2 flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-2 text-xs font-black text-[#F7B733]">
                    <DeepamFlameIcon className="w-4 h-4" /> Certified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Running Yellow Marquee Line — Immediately below hero section */}
      <MarqueeBanner initialText={settings.marquee} initialDiscount={discount} />

      {/* Category Section */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4 border-b border-[#172448] pb-4 md:pb-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#F7B733]">
              <DeepamFlameIcon className="w-4 h-4" /> EXPLORE BY CATEGORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white mt-1">
              Top Festive Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#F7B733] hover:text-[#FFD05C] transition-colors"
          >
            View Full Catalogue <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href} className="group">
              <div className="bg-[#101A36]/85 backdrop-blur-md border border-[#172448] rounded-3xl p-3 sm:p-4 shadow-2xl transition-all duration-300 group-hover:border-[#F7B733]/60 group-hover:-translate-y-1">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0B132B] mb-3 border border-[#172448] flex items-center justify-center p-3">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <span className="absolute top-2 left-2 bg-[#F7B733] text-[#101A36] text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {cat.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-bold text-xs sm:text-base text-white group-hover:text-[#F7B733] transition-colors line-clamp-2 leading-tight whitespace-normal break-words">
                    {cat.title}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-black bg-[#172448] text-[#F7B733] px-2 py-0.5 rounded-md shrink-0 ml-1">
                    {cat.count}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-1 hidden sm:block">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="py-10 bg-[#101A36]/80 border-y border-[#172448]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: Factory, title: 'Direct Dispatch', desc: 'Sivakasi manufacturing hub' },
            { icon: ShieldCheck, title: 'Certified Quality', desc: 'Eco-friendly green crackers' },
            { icon: PackageCheck, title: 'Safe Packing', desc: 'Damage-proof transport boxes' },
            { icon: Headphones, title: 'Desk Support', desc: 'Phone & email assistance' },
          ].map((item) => (
            <div key={item.title} className="p-3 sm:p-4 rounded-2xl bg-[#0B132B]/60 border border-[#172448]">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#172448] text-[#F7B733] flex items-center justify-center mx-auto mb-2">
                <item.icon size={18} />
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-white">{item.title}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order Enquiry CTA Banner */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101A36]/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 md:p-12 border border-[#F7B733]/40 shadow-2xl text-center relative overflow-hidden">
          
          {/* Decorative Deepam Oil Lamps — rendered IN FRONT at z-20 */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <DeepamFlameIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <DeepamFlameIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute bottom-4 left-6 z-20 pointer-events-none hidden sm:block">
            <DeepamFlameIcon className="w-7 h-7" />
          </div>
          <div className="absolute bottom-4 right-6 z-20 pointer-events-none hidden sm:block">
            <DeepamFlameIcon className="w-7 h-7" />
          </div>
          {/* Center top hanging Deepam */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
            <DeepamFlameIcon className="w-9 h-9" />
          </div>

          {/* Subtle background radial glow effects — behind content */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#F7B733]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-[#D95136]/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#F7B733]/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F7B733]/40 bg-[#0B132B] text-[#F7B733] text-[11px] sm:text-xs font-black uppercase tracking-widest">
              <DeepamFlameIcon className="w-4 h-4" /> NIKASH CRACKERS WHOLESALE
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
              Ready to Order Nikash Crackers Online?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Browse our complete price list, build your enquiry cart, and get direct factory confirmation within hours.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F7B733] px-6 sm:px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#101A36] hover:bg-[#FFD05C] transition-all min-h-[48px] shadow-lg"
              >
                Browse Complete Price List <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

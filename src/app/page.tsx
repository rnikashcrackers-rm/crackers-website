import Link from 'next/link';
import Image from 'next/image';
import { InteractiveHeroWrapper } from '@/components/effects/InteractiveHeroWrapper';
import { SlideInLeft, SlideInRight, ScrollFadeInUp } from '@/components/ui/ClientAnimation';
import { getSiteSettings } from '@/lib/settings';
import { Shield, Leaf, Factory, Package } from 'lucide-react';

export default async function HomePage() {
  const settings = await getSiteSettings();
  const globalDiscount = settings.global_discount || '60';
  const marqueeText = settings.marquee || 'Welcome to Nikash Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts!';

  const displayMarquee = marqueeText.includes('[discount]')
    ? marqueeText.replace(/\[discount\]/g, `${globalDiscount}%`)
    : `${marqueeText} — 🔥 FLAT ${globalDiscount}% DISCOUNT ON ALL ITEMS! 🔥`;

  return (
    <div className="flex flex-col bg-transparent -mt-24">

      {/* Hero Section */}
      <InteractiveHeroWrapper>
        {/* Dynamic Announcement Marquee Bar */}
        <div className="relative w-full bg-[#FF8A6B]/10 border-t border-b border-[#FF8A6B]/20 py-2 sm:py-2.5 overflow-hidden flex select-none z-30 mt-28">
          <div className="animate-marquee-horizontal flex gap-6 sm:gap-8 whitespace-nowrap uppercase tracking-[0.12em] sm:tracking-[0.15em] font-black text-[10px] sm:text-xs text-[#8C1D1D]">
            <span>{displayMarquee}</span>
            <span>🎆</span>
            <span>{displayMarquee}</span>
            <span>🎆</span>
            <span>{displayMarquee}</span>
            <span>🎆</span>
            <span>{displayMarquee}</span>
            <span>🎆</span>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-[1300px] mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Text and Filter Column */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start">
            <SlideInLeft className="max-w-2xl">
              
              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D241E] leading-[1.15] mb-6 tracking-tight text-left">
                Celebrate Every Moment <br />
                <span className="bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] bg-clip-text text-transparent">
                  with Sivakasi's Finest <br /> Crackers
                </span>
              </h1>

              {/* Subheading / Description */}
              <p className="text-[#5C544C] text-sm sm:text-base lg:text-lg mb-8 max-w-xl leading-relaxed">
                Explore our premium collection of gift boxes, sparklers, and aerial displays for a spectacular celebration.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link href="/products">
                  <button 
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-[0_8px_24px_rgba(255,107,74,0.3)] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Shop Now ↗
                  </button>
                </Link>
                <Link href="/products">
                  <button 
                    className="px-8 py-3.5 rounded-full border border-[#FF8A6B] bg-white/40 backdrop-blur-sm text-[#FF8A6B] font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#FF8A6B]/5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    View Catalogue
                  </button>
                </Link>
              </div>

              {/* Horizontal Category pills exactly matching the reference design */}
              <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#E8E2D8]/50">
                {[
                  { label: 'Sparklers', icon: '🪄', href: '/products?category=sparklers' },
                  { label: 'Flower Pots', icon: '🪴', href: '/products?category=flowerpots' },
                  { label: 'Rockets', icon: '🚀', href: '/products?category=rockets' },
                  { label: 'New Arrivals', icon: '⭐', href: '/products?category=new' },
                ].map((pill, i) => (
                  <Link key={i} href={pill.href}>
                    <div className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-white/60 border border-black/5 hover:border-[#FF8A6B] hover:bg-white text-[11px] font-bold text-[#5C544C] hover:text-[#8C1D1D] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all cursor-pointer">
                      <span>{pill.icon}</span>
                      <span>{pill.label}</span>
                    </div>
                  </Link>
                ))}
              </div>

            </SlideInLeft>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <SlideInRight className="relative w-full max-w-[420px] aspect-square flex items-center justify-center" delay={0.25}>
              {/* Soft background glow overlay */}
              <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(255,107,74,0.15) 0%, transparent 60%) pointer-events-none -z-10" />
              
              {/* Glassmorphic border container */}
              <div className="relative w-full h-full rounded-[40px] border border-white/40 shadow-xl overflow-hidden flex items-center justify-center p-6 bg-white/10 backdrop-blur-md">
                <Image 
                  src="/hero_gift_box.png" 
                  alt="Nikash Crackers Premium Gift Box overflowing with fireworks" 
                  fill 
                  className="object-contain p-6 drop-shadow-[0_20px_45px_rgba(255,107,74,0.18)] select-none"
                  priority
                  sizes="(max-width: 640px) 100vw, 420px"
                />
                
                {/* Brand label overlay on crackers box */}
                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-2xl bg-gradient-to-r from-[#FF8A6B] to-[#FF5C7A] text-white font-display font-black text-sm uppercase tracking-widest shadow-md border border-white/20 select-none">
                  NIKASH
                </div>
              </div>
            </SlideInRight>
          </div>

        </div>
      </InteractiveHeroWrapper>

      {/* Shop by Category Section */}
      <section className="py-16 max-w-[1300px] mx-auto px-6 w-full">
        <ScrollFadeInUp>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#2D241E] mb-8 select-none">
            Shop by Category
          </h2>
        </ScrollFadeInUp>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'GIFT BOXES',
              symbol: '🎁',
              gradient: 'from-[#FFD3B6] to-[#FF8A6B]',
              image: '/hero_gift_box.png',
              href: '/products?category=giftbox',
            },
            {
              title: 'SPARKLERS',
              symbol: '🪄',
              gradient: 'from-[#D2E0FB] to-[#8E9BFF]',
              image: '/product-assets/10-cm-color-sparkler-110.jpg',
              href: '/products?category=sparklers',
            },
            {
              title: 'FLOWER POTS',
              symbol: '🪴',
              gradient: 'from-[#F9F3CC] to-[#FF8E8F]',
              image: '/product-assets/flower-pot-special-17.jpg',
              href: '/products?category=flowerpots',
            },
            {
              title: 'AERIAL SHOTS',
              symbol: '🚀',
              gradient: 'from-[#E1AFD1] to-[#A98CF0]',
              image: '/product-assets/12-shots-97.jpg',
              href: '/products?category=multishots',
            },
          ].map((cat, i) => (
            <ScrollFadeInUp key={i} delay={i * 0.08}>
              <Link href={cat.href}>
                <div className={`relative overflow-hidden rounded-3xl h-64 p-6 flex flex-col justify-between group shadow-md hover:shadow-xl transition-all cursor-pointer`}>
                  {/* Gradient Backing */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 transition-transform group-hover:scale-[1.03] duration-500`} />
                  
                  {/* Floating Category Symbol Badge */}
                  <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/40 backdrop-blur-xs border border-white/30 flex items-center justify-center text-sm shadow-sm select-none z-10 group-hover:scale-105 transition-transform duration-300">
                    {cat.symbol}
                  </div>

                  {/* Category Image */}
                  <div className="absolute right-[-10%] bottom-[-5%] w-36 h-36 opacity-95 group-hover:scale-110 duration-500 select-none">
                    <Image src={cat.image} alt={cat.title} fill className="object-contain" sizes="144px" />
                  </div>

                  {/* Card Header Content */}
                  <div className="relative z-10">
                    <h3 className="font-display font-black text-xl text-[#2D241E] tracking-tight leading-none mb-1">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Explore Button */}
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-white text-xs font-bold text-[#2D241E] shadow-sm group-hover:bg-[#8C1D1D] group-hover:text-white transition-colors">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollFadeInUp>
          ))}
        </div>
      </section>

      {/* TRUST BADGES Section */}
      <section className="py-12 border-y border-[#E8E2D8]/40 bg-white/20 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 w-full">
          {[
            { icon: Shield, title: 'Uncompromising Safety', desc: 'Fully Safety Certified' },
            { icon: Leaf, title: 'Eco-Conscious', desc: 'Sustainable Green Crackers' },
            { icon: Factory, title: 'Direct Source', desc: 'Authentic Sivakasi Pricing' },
            { icon: Package, title: 'Premium Logistics', desc: 'Secure Packaging' }
          ].map((b, i) => (
            <ScrollFadeInUp key={i} delay={i * 0.08} className="flex flex-col items-center text-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#FF8A6B] flex items-center justify-center border border-[#E8E2D8]/30 group-hover:border-[#FF8A6B]/50 group-hover:bg-[#FF8A6B]/5 transition-all duration-300">
                <b.icon size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-[#2D241E] text-xs sm:text-sm tracking-tight">{b.title}</h3>
                <p className="text-[10px] sm:text-xs text-[#5C544C] font-semibold">{b.desc}</p>
              </div>
            </ScrollFadeInUp>
          ))}
        </div>
      </section>

      {/* CTA BANNER - Red Gradient Banner */}
      <section className="py-16 relative overflow-hidden max-w-[1300px] mx-auto px-6 w-full" id="cta">
        <ScrollFadeInUp className="relative overflow-hidden w-full rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A6B] via-[#FF6B4A] to-[#FF5C7A] opacity-95" />
          
          <div className="relative z-10 py-16 text-center flex flex-col items-center justify-center px-6 sm:px-12">
            <div className="text-3xl mx-auto mb-4 select-none">🎆</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4 leading-tight tracking-tight">
              Ready to Light Up <br /> Your Next Celebration?
            </h2>
            <p className="mx-auto mb-8 text-center text-white/90 text-sm sm:text-base max-w-lg leading-relaxed font-semibold">
              Browse our premium collection or speak with our team for bulk event orders and wholesale pricing.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/products">
                <button className="px-6 py-3 rounded-full bg-white text-[#FF5C7A] font-extrabold text-xs sm:text-sm shadow-md hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer">
                  Shop Now →
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-6 py-3 rounded-full border border-white bg-transparent text-white font-extrabold text-xs sm:text-sm hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </ScrollFadeInUp>
      </section>
    </div>
  );
}

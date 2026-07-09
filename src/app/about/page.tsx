import Image from 'next/image';
import Link from 'next/link';
import { AnimatedKolam } from '@/components/ui/AnimatedKolam';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { FadeIn, FadeInUp, FadeInUpLarge, ScrollFadeInUp, ScrollSlideInLeft, ScrollSlideInRight } from '@/components/ui/ClientAnimation';
import { Shield, Leaf, Factory, Award, Users, Clock, Target, Heart, ArrowRight, Sparkles, Star, MapPin } from 'lucide-react';

const timeline = [
  { year: '2015', title: 'The Beginning', desc: 'Founded in Sivakasi with a vision to create premium fireworks for every celebration.' },
  { year: '2018', title: 'Facility Expansion', desc: 'Expanded manufacturing capabilities and introduced 200+ premium product lines.' },
  { year: '2021', title: 'Digital Transformation', desc: 'Launched direct-to-consumer online booking, offering factory pricing across India.' },
  { year: '2024', title: 'National Presence', desc: 'Over a decade of excellence. Serving 10,000+ families with 500+ safe, high-quality products.' },
];

const values = [
  { icon: Shield, title: 'Safety First', desc: 'Every product undergoes rigorous quality testing. We follow the highest safety standards in manufacturing.' },
  { icon: Leaf, title: 'Eco-Conscious', desc: 'Our green crackers reduce pollution by 40%. We invest in sustainable practices for a better tomorrow.' },
  { icon: Heart, title: 'Customer Love', desc: 'Every order is handled with personal care. From selection to delivery, we ensure a premium experience.' },
  { icon: Target, title: 'Quality Promise', desc: 'Over a decade of perfecting our craft. Each sparkle, each burst is a testament to our unwavering quality.' },
];

const teamMembers = [
  { name: 'Founder', role: 'Managing Director', desc: 'Our founder laid the foundation of NIKASH CRACKERS with a vision to make celebrations safer and brighter.' },
  { name: 'Operations Head', role: 'Production Director', desc: 'Overseeing 500+ product lines with precision. Ensuring every cracker meets our quality standards.' },
  { name: 'Quality Team', role: 'Safety & Compliance', desc: 'Our dedicated QC team tests every batch. ISO certified processes ensure the highest safety margins.' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <AnimatedKolam className="absolute -left-20 top-0" size={500} color="#FF8A6B" />
          <AnimatedKolam className="absolute -right-20 bottom-0 rotate-180" size={500} color="#FF8A6B" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <FadeIn className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--color-coral)]/40 bg-[var(--color-coral)]/10 text-[var(--color-coral)] text-xs font-black tracking-[0.4em] uppercase mb-8">
            <Sparkles size={14} /> Our Heritage
          </FadeIn>
          
          <FadeInUpLarge delay={0.2} className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter">
              Over a Decade of
              <span className="block text-gradient-coral text-glow">Brilliance</span>
            </h1>
          </FadeInUpLarge>
          
          <FadeIn delay={0.4}>
            <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed font-light">
              Born in the heart of Sivakasi, refined by time, and celebrated across the nation. NIKASH CRACKERS has been 
              crafting moments of joy.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Logo & Story Section */}
      <section className="py-24 bg-[var(--surface-high)] border-y border-[var(--border)]/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <ScrollFadeInUp className="relative flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-coral)]/20 to-transparent animate-spin-slow" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-[var(--color-coral)]/30 shadow-[0_0_60px_rgba(212,175,55,0.2)] bg-white">
                <Image src="/logo/logo.png" alt="NIKASH CRACKERS Logo" fill className="object-cover dark:brightness-[0.9] dark:contrast-[1.1] transition-all duration-300" sizes="(max-width: 768px) 300px, 400px" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-coral)]/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
            </div>
          </ScrollFadeInUp>
          
          <ScrollSlideInRight>
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-coral)] uppercase tracking-[0.4em] mb-6">
              <div className="w-8 h-[1px] bg-[var(--color-coral)]" /> Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-[var(--text)] leading-tight tracking-tighter">
              From a Workshop to a <span className="text-gradient-coral">Legacy</span>
            </h2>
            <p className="text-lg text-[var(--text)]/60 leading-relaxed mb-6">
              In 2015, our founder set out in Sivakasi — India&apos;s fireworks capital — with a singular vision: 
              to create fireworks that don&apos;t just light up the sky, but illuminate hearts.
            </p>
            <p className="text-lg text-[var(--text)]/60 leading-relaxed mb-8">
              What started as a small workshop has grown into one of Sivakasi&apos;s most trusted fireworks manufacturers. 
              Today, NIKASH CRACKERS (Nikash) serves over 10,000 families across India with 500+ premium products, 
              maintaining the same passion for quality and safety that defined our founder&apos;s first sparkler.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-coral)]/10 text-[var(--color-coral)] text-sm font-bold">
                <MapPin size={14} /> Sivakasi, Tamil Nadu
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-coral)]/10 text-[var(--color-coral)] text-sm font-bold">
                <Award size={14} /> Est. 2015
              </div>
            </div>
          </ScrollSlideInRight>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: 11, suffix: '+', label: 'Years of Excellence', icon: Clock },
            { value: 10000, suffix: '+', label: 'Happy Families', icon: Users },
            { value: 500, suffix: '+', label: 'Premium Products', icon: Factory },
            { value: 100, suffix: '%', label: 'Safety Certified', icon: Shield },
          ].map((s, i) => (
            <ScrollFadeInUp key={s.label} delay={i * 0.1} className="text-center group">
              <div className="w-20 h-20 rounded-full bg-white/5 text-[var(--color-coral)] flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all">
                <s.icon size={32} />
              </div>
              <div className="text-4xl md:text-5xl font-display font-bold text-[var(--text)] mb-2 tracking-tighter">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">{s.label}</div>
            </ScrollFadeInUp>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[var(--surface-high)] border-y border-[var(--border)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollFadeInUp className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-coral)] uppercase tracking-[0.4em] mb-6">Our Journey</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">The NIKASH CRACKERS Timeline</h2>
          </ScrollFadeInUp>
          
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-coral)]/20 hidden md:block" />
            
            <div className="space-y-12 md:space-y-0">
              {timeline.map((item, i) => (
                <ScrollFadeInUp key={item.year} delay={i * 0.1}
                  className={`relative md:flex md:items-center md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:mb-16`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass-card rounded-2xl p-8 hover:border-[var(--color-coral)]/40 transition-all">
                      <div className="text-3xl font-display font-bold text-[var(--color-coral)] mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-[var(--text)] mb-3">{item.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-coral-dark)] items-center justify-center text-[#1a1400] font-black text-sm shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] z-10">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div className="flex-1" />
                </ScrollFadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollFadeInUp className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-coral)] uppercase tracking-[0.4em] mb-6">What We Believe In</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">Our Core Values</h2>
          </ScrollFadeInUp>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <ScrollFadeInUp key={v.title} delay={i * 0.1}
                className="glass-card rounded-3xl p-8 text-center group hover:border-[var(--color-coral)]/40">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-coral)]/10 text-[var(--color-coral)] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <v.icon size={36} />
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text)] mb-3">{v.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
              </ScrollFadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[var(--surface-high)] border-y border-[var(--border)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollFadeInUp className="text-center mb-20">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-coral)] uppercase tracking-[0.4em] mb-6">The People Behind JJ</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">Our Leadership</h2>
          </ScrollFadeInUp>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((m, i) => (
              <ScrollFadeInUp key={m.name} delay={i * 0.1}
                className="glass-card rounded-3xl p-8 text-center group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-coral-dark)] flex items-center justify-center mx-auto mb-6 text-[#1a1400] text-2xl font-black shadow-xl">
                  {m.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--text)] mb-1">{m.name}</h3>
                <div className="text-xs text-[var(--color-coral)] font-bold uppercase tracking-[0.15em] mb-4">{m.role}</div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{m.desc}</p>
              </ScrollFadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollFadeInUp className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-black text-[var(--color-coral)] uppercase tracking-[0.4em] mb-6">Trust & Quality</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[var(--text)] tracking-tighter">Certifications</h2>
          </ScrollFadeInUp>
          
          <div className="max-w-3xl mx-auto text-center">
            <ScrollFadeInUp className="glass-card rounded-3xl p-10 md:p-12 hover:border-[var(--color-coral)]/40 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-5xl opacity-20">🛡️</div>
              <div className="text-5xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold font-display text-[var(--text)] mb-4">Fully Certified Manufacturer</h3>
              <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
                We are a fully safety-certified and government-licensed fireworks manufacturer. 
                Our production processes follow the highest standards of safety and quality control to ensure 
                a secure and joyful celebration for you and your family.
              </p>
            </ScrollFadeInUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[var(--surface-high)] border-t border-[var(--border)]/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollFadeInUp>
            <Sparkles size={48} className="mx-auto mb-8 text-[var(--color-coral)] animate-bounce" />
            <h2 className="text-4xl md:text-6xl font-display font-bold text-[var(--text)] mb-6 tracking-tighter">
              Ready to Experience <br /><span className="text-gradient-coral">Our Excellence?</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
              Browse our premium collection of Sivakasi&apos;s finest fireworks and let us make your celebration extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <button className="px-10 py-4 rounded-full bg-gradient-to-r from-[var(--color-coral-light)] via-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold text-lg flex items-center gap-3 shadow-lg hover:scale-105 active:scale-97 cursor-pointer transition-all duration-200">
                  Shop Now <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[var(--text)] font-bold text-lg hover:border-[var(--color-coral)] hover:text-[var(--color-coral)] hover:scale-105 active:scale-97 cursor-pointer transition-all duration-200">
                  Contact Us
                </button>
              </Link>
            </div>
          </ScrollFadeInUp>
        </div>
      </section>
    </div>
  );
}

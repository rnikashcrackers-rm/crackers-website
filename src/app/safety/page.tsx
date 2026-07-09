import { Phone, AlertTriangle } from 'lucide-react';
import { FadeInUp, ScrollFadeInUp } from '@/components/ui/ClientAnimation';

const safetyTips = [
  { key: 'children', emoji: '👦', title: 'Children Safety', color: 'hover:border-blue-500/40',
    points: ['Never allow children under 12 to handle crackers alone', 'Keep a responsible adult present', 'Maintain 5+ meters safe distance', 'Never point crackers at others'] },
  { key: 'lighting', emoji: '🔥', title: 'Lighting Tips', color: 'hover:border-orange-500/40',
    points: ['Use incense sticks to light crackers', 'Never use matches directly', 'Light one at a time', 'Retreat after lighting the fuse'] },
  { key: 'water', emoji: '🪣', title: 'Keep Water Ready', color: 'hover:border-cyan-500/40',
    points: ['Keep buckets of water nearby', 'Douse used crackers before disposal', 'Keep first aid kit handy', 'Never relight a dud cracker'] },
  { key: 'protection', emoji: '👓', title: 'Physical Protection', color: 'hover:border-purple-500/40',
    points: ['Wear protective eyewear', 'Use earplugs for loud crackers', 'Never lean over while lighting', 'Protect eyes from sparks'] },
  { key: 'storage', emoji: '📦', title: 'Safe Storage', color: 'hover:border-amber-500/40',
    points: ['Store in cool, dry areas', 'Keep away from heat & flames', 'Store in original packaging', 'Keep from pets & children'] },
  { key: 'eco', emoji: '🌿', title: 'Eco-Conscious', color: 'hover:border-emerald-500/40',
    points: ['Choose Green Cracker range', 'Follow timing restrictions', 'Dispose waste in bins', 'Be mindful of neighbors'] },
];

export default function SafetyPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <FadeInUp className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/5 text-rose-500 text-xs font-bold mb-6 tracking-[0.2em] uppercase">
          <AlertTriangle size={12} /> Safety Guidelines
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            A Celebration <br /><span className="text-gradient-coral text-glow">Without Risks</span>
          </h1>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <p className="text-lg text-[var(--text-muted)]">
            Your joy is our priority, but safety is our responsibility.
          </p>
        </FadeInUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {safetyTips.map((tip, i) => (
          <ScrollFadeInUp key={tip.key} delay={i * 0.05}
            className={`glass-card rounded-3xl p-7 transition-all ${tip.color}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-high)] flex items-center justify-center text-2xl border border-[var(--border)]">{tip.emoji}</div>
              <div><h3 className="text-lg font-bold font-display">{tip.title}</h3><div className="h-0.5 w-8 bg-[var(--color-coral)] rounded-full mt-1" /></div>
            </div>
            <ul className="space-y-3">
              {tip.points.map((p, j) => (
                <li key={j} className="flex gap-3 text-sm text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-coral)] mt-2 shrink-0" />{p}
                </li>
              ))}
            </ul>
          </ScrollFadeInUp>
        ))}
      </div>

      {/* Emergency Contact */}
      <div className="max-w-2xl mx-auto">
        <ScrollFadeInUp className="glass-card rounded-3xl p-8 border-rose-500/20 bg-rose-500/5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 text-4xl opacity-10">🚨</div>
          <h3 className="text-xl font-bold font-display mb-3 text-rose-400">Emergency Protocol</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            In the highly unlikely event of an accident, keep calm and contact local emergency services immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:101" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-colors">
              <Phone size={16} /> Fire Station (101)
            </a>
            <a href="tel:108" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-colors">
              <Phone size={16} /> Ambulance (108)
            </a>
          </div>
        </ScrollFadeInUp>
      </div>
    </div>
  );
}

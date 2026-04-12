import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

// ─── DATA ──────────────────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    icon: '⚡', name: 'Power Lifting', tag: 'STRENGTH',
    desc: 'Master the big three with elite programming designed for serious strength gains and competition prep.',
    sessions: '3x/week', level: 'All Levels',
    // Replace src with actual 8K AI image URL
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  },
  {
    icon: '🔥', name: 'HIIT Cardio', tag: 'ENDURANCE',
    desc: 'High-intensity intervals that torch calories, shred fat, and skyrocket your cardiovascular capacity.',
    sessions: '5x/week', level: 'Intermediate',
    img: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&q=80',
  },
  {
    icon: '🧘', name: 'Mind & Body', tag: 'WELLNESS',
    desc: 'Yoga, pilates and deep mobility work to unlock flexibility, balance, and mental clarity.',
    sessions: '4x/week', level: 'Beginner',
    img: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80',
  },
  {
    icon: '🥊', name: 'Combat Sports', tag: 'COMBAT',
    desc: 'Boxing, kickboxing and MMA fundamentals. Build real-world power, speed, and defense.',
    sessions: '3x/week', level: 'All Levels',
    img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80',
  },
  {
    icon: '🏋️', name: 'Olympic Lifting', tag: 'OLYMPIC',
    desc: 'Snatch and clean & jerk coaching from certified Olympic weightlifting coaches.',
    sessions: '4x/week', level: 'Advanced',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
  },
  {
    icon: '🚴', name: 'Cycling Studio', tag: 'CARDIO',
    desc: 'Immersive indoor cycling with precision power tracking and heart-rate-driven coaching.',
    sessions: '6x/week', level: 'All Levels',
    img: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80',
  },
];

const TRAINERS = [
  {
    initials: 'RK', name: 'Raj Kumar', role: 'Head Trainer & Strength Coach',
    exp: '12 Years', cert: 'NSCA-CSCS',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    specialties: ['Power Lifting', 'Olympic Lifting', 'Strength Programming'],
  },
  {
    initials: 'PD', name: 'Priya Devi', role: 'Yoga & Mobility Specialist',
    exp: '9 Years', cert: 'RYT-500',
    img: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=80',
    specialties: ['Yoga', 'Pilates', 'Mobility Therapy'],
  },
  {
    initials: 'AM', name: 'Aryan Mehta', role: 'Combat Sports Coach',
    exp: '8 Years', cert: 'AIBA Level 2',
    img: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80',
    specialties: ['Boxing', 'Kickboxing', 'MMA Fundamentals'],
  },
  {
    initials: 'SK', name: 'Sahil Khan', role: 'Nutrition & Fat Loss Expert',
    exp: '7 Years', cert: 'ISSA-CPT, CN',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    specialties: ['Nutrition Coaching', 'Fat Loss', 'HIIT'],
  },
];

const FACILITIES = [
  { name: 'Olympic Lifting Platform', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80' },
  { name: 'Cardio Zone', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80' },
  { name: 'Free Weights Area', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { name: 'Yoga Studio', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80' },
  { name: 'Combat Ring', img: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80' },
  { name: 'Recovery Lounge', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
];

const STATS = [
  { num: 2800, suffix: '+', label: 'Active Members' },
  { num: 48,   suffix: '',  label: 'Weekly Classes' },
  { num: 12,   suffix: '+', label: 'Elite Trainers' },
  // { num: 8,    suffix:  label: 'Years Strong' },
];

const MARQUEE_WORDS = ['STRENGTH', '·', 'POWER', '·', 'ENDURANCE', '·', 'DISCIPLINE', '·', 'IRON WILL', '·', 'FORGE YOUR BODY', '·'];

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function Marquee({ reverse }) {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="border-t border-b border-white/10 overflow-hidden bg-white/[0.02] py-3">
      <div className="flex gap-10 whitespace-nowrap"
        style={{ animation: `${reverse ? 'marqueeScrollRev' : 'marqueeScroll'} 28s linear infinite` }}>
        {items.map((w, i) => (
          <span key={i}
            className={`font-orbitron text-xs tracking-widest uppercase flex-shrink-0 ${w === '·' ? 'text-white/20' : 'text-white/40'}`}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatItem({ num, suffix, label }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <div ref={ref} className="flex-1 min-w-[140px] py-8 px-6 text-center border-r border-white/10 last:border-r-0 hover:bg-white/[0.02] transition-colors">
      <div className="font-bebas text-5xl leading-none tracking-wide">
        {inView ? <CountUp end={num} duration={2.5} /> : '0'}{suffix}
      </div>
      <div className="font-grotesk text-xs tracking-widest uppercase text-white/40 mt-2">{label}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function LandingPage({ onLogin, onSignup }) {
  const heroRef = useRef(null);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative z-10">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 overflow-hidden">
        {/* Background hero image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=90"
            alt="IronForge Gym"
            className="w-full h-full object-cover opacity-20"
            ref={heroRef}
          />
          <div className="img-hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p className="font-orbitron text-xs tracking-[0.5em] text-white/40 uppercase mb-8
                        animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            Varanasi's Premier Fitness Destination
          </p>

          {/* Giant title */}
          <h1 className="font-bebas leading-[0.88] tracking-wide animate-fadeUp"
              style={{ fontSize: 'clamp(5rem, 18vw, 14rem)', animationDelay: '0.4s' }}>
            IRON
            <br />
            <span className="text-outline">FORGE</span>
          </h1>

          <p className="font-grotesk text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed my-8
                        animate-fadeUp" style={{ animationDelay: '0.6s' }}>
            Where legends are forged. World-class training, elite coaches, and a community built for those who refuse to settle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeUp" style={{ animationDelay: '0.8s' }}>
            <button onClick={onSignup} className="btn-primary px-10 py-4">
              START FOR FREE →
            </button>
            <button onClick={onLogin} className="btn-outline px-10 py-4">
              MEMBER LOGIN
            </button>
            <Link to="/pricing" className="btn-outline px-10 py-4 inline-flex items-center justify-center">
              VIEW PRICING
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          <span className="font-orbitron text-[10px] tracking-widest text-white/30">SCROLL</span>
        </div>
      </section>

      {/* ── MARQUEE 1 ─────────────────────────────────────────── */}
      <Marquee />

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto flex flex-wrap">
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── PROGRAMS ──────────────────────────────────────────── */}
      <section id="programs" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="font-orbitron text-xs tracking-widest text-white/30 uppercase mb-3">What We Offer</p>
          <h2 className="font-bebas text-6xl sm:text-8xl tracking-wide">PROGRAMS</h2>
          <div className="w-16 h-px bg-white/30 mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {PROGRAMS.map(p => (
            <div key={p.name}
              className="group bg-black relative overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/[0.04]">
              {/* Program image */}
              <div className="relative h-52 overflow-hidden">
                <img src={p.img} alt={p.name}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <span className="absolute top-4 right-4 font-orbitron text-[10px] tracking-widest text-white/50 border border-white/15 px-2 py-1">
                  {p.tag}
                </span>
                <span className="absolute bottom-4 left-4 text-3xl">{p.icon}</span>
              </div>

              <div className="p-6">
                <h3 className="font-orbitron font-bold text-sm tracking-wider mb-3">{p.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex justify-between text-xs font-grotesk text-white/30 border-t border-white/10 pt-4">
                  <span>{p.sessions}</span>
                  <span>{p.level}</span>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-6 text-white/20 group-hover:text-white/70 transition-all duration-300 text-lg">
                →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE 2 (reverse) ───────────────────────────────── */}
      <Marquee reverse />

      {/* ── TRAINERS ──────────────────────────────────────────── */}
      <section id="trainers" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="font-orbitron text-xs tracking-widest text-white/30 uppercase mb-3">The Team</p>
          <h2 className="font-bebas text-6xl sm:text-8xl tracking-wide">TRAINERS</h2>
          <div className="w-16 h-px bg-white/30 mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINERS.map(t => (
            <div key={t.name}
              className="group border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden">
              {/* Trainer photo */}
              <div className="relative h-72 overflow-hidden">
                <img src={t.img} alt={t.name}
                  className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-bebas text-2xl leading-none">{t.name}</div>
                  <div className="font-grotesk text-xs text-white/50 mt-0.5">{t.role}</div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between text-xs font-orbitron text-white/30 mb-4">
                  <span>{t.exp} Exp.</span>
                  <span>{t.cert}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.specialties.map(s => (
                    <span key={s} className="font-grotesk text-[10px] tracking-wider text-white/40 border border-white/10 px-2 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FACILITIES ────────────────────────────────────────── */}
      <section id="facilities" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="font-orbitron text-xs tracking-widest text-white/30 uppercase mb-3">World-Class</p>
          <h2 className="font-bebas text-6xl sm:text-8xl tracking-wide">FACILITIES</h2>
          <div className="w-16 h-px bg-white/30 mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {FACILITIES.map((f, i) => (
            <div key={f.name}
              className={`group relative overflow-hidden ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}`}
              style={{ height: i === 0 ? '360px' : '240px' }}>
              <img src={f.img} alt={f.name}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="font-orbitron text-xs tracking-widest text-white/50 uppercase">{f.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section id="about" className="py-32 px-4 text-center border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <p className="font-orbitron text-xs tracking-widest text-white/30 uppercase mb-6">Ready to Begin?</p>
          <h2 className="font-bebas text-6xl sm:text-9xl tracking-wide leading-none mb-8">
            FORGE YOUR<br /><span className="text-outline">LEGEND</span>
          </h2>
          <p className="font-grotesk text-white/40 mb-12 leading-relaxed">
            Join 2800+ members who chose to transform. Your first month is on us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onSignup} className="btn-primary px-12 py-4 text-base">
              START FREE TRIAL
            </button>
            <Link to="/pricing" className="btn-outline px-12 py-4 text-base inline-flex items-center justify-center">
              VIEW PLANS
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-orbitron font-black text-lg tracking-widest mb-1">
              IRON<span className="text-white/30">FORGE</span>
            </div>
            <p className="font-grotesk text-xs text-white/30">Varanasi · Uttar Pradesh · Est. 2016</p>
          </div>
          <div className="flex gap-8 text-xs font-grotesk text-white/30">
            <a href="/#programs" className="hover:text-white transition-colors">Programs</a>
            <a href="/#trainers" className="hover:text-white transition-colors">Trainers</a>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="font-grotesk text-xs text-white/20">© 2025 IronForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

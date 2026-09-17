'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Zap, Layers, Sparkles, History, ChevronRight, Star } from 'lucide-react';
import { getAuth } from '@/lib/storage';
import { FEATURE_HIGHLIGHTS, DEMO_PROMPTS } from '@/lib/data';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap size={20} />,
  Layers: <Layers size={20} />,
  Sparkles: <Sparkles size={20} />,
  History: <History size={20} />,
};

const PREVIEW_CARDS = [
  { gradient: 'linear-gradient(135deg, #1a0533 0%, #4a1a7a 40%, #0d0020 100%)', label: 'Sci-fi corridor, volumetric fog', type: 'VIDEO' },
  { gradient: 'linear-gradient(135deg, #001a2e 0%, #003d5c 40%, #000e19 100%)', label: 'Ocean sunrise, 4K ultra-wide', type: 'IMAGE' },
  { gradient: 'linear-gradient(135deg, #1a0800 0%, #4d1f00 40%, #0d0400 100%)', label: 'Desert dunes at golden hour', type: 'VIDEO' },
  { gradient: 'linear-gradient(135deg, #001a10 0%, #004d2e 40%, #000d08 100%)', label: 'Bioluminescent forest', type: 'IMAGE' },
  { gradient: 'linear-gradient(135deg, #1a0a1a 0%, #4d1f4d 40%, #0d050d 100%)', label: 'Cyberpunk city rain', type: 'VIDEO' },
  { gradient: 'linear-gradient(135deg, #0d1a00 0%, #2e4d00 40%, #060d00 100%)', label: 'Northern lights timelapse', type: 'VIDEO' },
];

const SOCIAL_PROOF = [
  { handle: '@mia_creates', text: 'Forge\'s video quality is absolutely insane. Nothing else comes close for cinematic shots.', stars: 5 },
  { handle: '@studio_north', text: 'We replaced 3 tools with Forge. Our production pipeline is half the time it used to be.', stars: 5 },
  { handle: '@lens_ai', text: 'First tool I\'ve used that actually nails motion quality. Every frame looks intentional.', stars: 5 },
];

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    setIsAuthenticated(auth.isAuthenticated);

    const interval = setInterval(() => {
      setPromptIdx(i => (i + 1) % DEMO_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--accent)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
            Forge
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Go to Studio <ArrowRight size={15} />
              </button>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <button className="btn-ghost" style={{ fontSize: '0.875rem' }}>Sign in</button>
              </Link>
              <Link href="/auth?mode=signup">
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  Get Started <ArrowRight size={15} />
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: 'relative', paddingTop: '140px', paddingBottom: '100px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '140px 1.5rem 100px',
      }}>
        {/* Background radial glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="noise-overlay" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0.875rem', borderRadius: 9999,
            border: '1px solid rgba(255,107,53,0.3)',
            background: 'rgba(255,107,53,0.08)',
            marginBottom: '1.75rem',
          }}>
            <Sparkles size={13} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
              Forge Video 2 — Now Available
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Space Grotesk', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', maxWidth: 860, margin: '0 auto 1.5rem',
          }}>
            Create cinematic AI visuals{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b35, #ff9a70)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              from a single prompt
            </span>
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)',
            maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.65,
          }}>
            Professional-grade video and image generation. No creative limits, no complicated tools —
            just describe what you see, and Forge brings it to life.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link href={isAuthenticated ? '/dashboard/create' : '/auth?mode=signup'}>
              <button className="btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
                Start Creating Free <ArrowRight size={18} />
              </button>
            </Link>
            <Link href={isAuthenticated ? '/dashboard' : '/auth'}>
              <button className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                <Play size={16} fill="currentColor" /> Watch Demo
              </button>
            </Link>
          </div>

          {/* Rotating prompt preview */}
          <div style={{
            maxWidth: 640, margin: '0 auto',
            padding: '1rem 1.25rem', borderRadius: 12,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem', textAlign: 'left' }}>
              Try prompts like...
            </p>
            <p
              key={promptIdx}
              style={{
                fontSize: '0.9rem', color: 'var(--text-secondary)',
                textAlign: 'left', lineHeight: 1.5,
                animation: 'fadeIn 0.4s ease-out',
              }}
            >
              "{DEMO_PROMPTS[promptIdx]}"
            </p>
          </div>
        </div>
      </section>

      {/* PREVIEW GRID */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {PREVIEW_CARDS.map((card, i) => (
            <div
              key={i}
              className="generation-card card-hover"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Thumbnail */}
              <div style={{
                height: 200, background: card.gradient,
                display: 'flex', alignItems: 'flex-end', padding: '0.75rem',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Floating play icon for video */}
                {card.type === 'VIDEO' && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    <Play size={18} fill="white" color="white" style={{ marginLeft: 2 }} />
                  </div>
                )}
                <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{card.type}</span>
              </div>
              <div style={{ padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center', fontFamily: 'Space Grotesk',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700,
            marginBottom: '0.75rem', color: 'var(--text-primary)',
          }}>
            Built for serious creators
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1rem' }}>
            Every feature designed around your creative workflow, not the other way around.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}>
            {FEATURE_HIGHLIGHTS.map((f, i) => (
              <div key={i} style={{
                padding: '1.5rem',
                background: 'var(--bg-elevated)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--accent-dim)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', marginBottom: '1rem',
                }}>
                  {ICON_MAP[f.icon]}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center', fontFamily: 'Space Grotesk',
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700,
            marginBottom: '2.5rem',
          }}>
            Loved by creators worldwide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {SOCIAL_PROOF.map((s, i) => (
              <div key={i} style={{
                padding: '1.5rem',
                background: 'var(--bg-surface)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.875rem' }}>
                  {Array.from({ length: s.stars }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  "{s.text}"
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.handle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', textAlign: 'center',
          padding: '3rem 2rem', borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.04) 100%)',
          border: '1px solid rgba(255,107,53,0.2)',
        }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Your first 50 generations are free
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            No credit card required. Start creating in 30 seconds.
          </p>
          <Link href={isAuthenticated ? '/dashboard/create' : '/auth?mode=signup'}>
            <button className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Start for free <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 22, height: 22, background: 'var(--accent)',
            borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={12} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'Space Grotesk' }}>Forge</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2026 Forge AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

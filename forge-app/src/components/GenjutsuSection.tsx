'use client';

import { Sparkles, ArrowRight, Play, RefreshCw, Zap } from 'lucide-react';

interface GenjutsuSectionProps {
  onStartGenerate?: () => void;
  onLearnMore?: () => void;
}

export default function GenjutsuSection({ onStartGenerate, onLearnMore }: GenjutsuSectionProps) {
  return (
    <section id="genjutsu" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-lime)',
        borderRadius: 24,
        padding: 'clamp(2rem, 5vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(200, 255, 0, 0.08)',
      }}>
        {/* Background glow circle */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(200, 255, 0, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Left Column Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: 'rgba(200, 255, 0, 0.15)',
                color: 'var(--accent-lime)',
                border: '1px solid var(--border-lime)',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.25rem 0.75rem',
                borderRadius: 9999,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                MOTION TRANSFER ENGINE
              </span>
            </div>

            <h2 className="heading-display" style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              color: '#ffffff',
              lineHeight: 1.05,
              margin: 0,
            }}>
              FORGEFIELD <span style={{ color: 'var(--accent-lime)' }}>GENJUTSU</span>
            </h2>

            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              Reality Manipulation — transfer motion into new scenes, or swap details while everything else stays as filmed.
            </p>

            {/* Feature Bullet Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {[
                'Zero-flicker temporal motion locking',
                'Multi-subject motion retargeting in 4K',
                'Environment style swap with physics retention'
              ].map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--accent-lime-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Zap size={12} color="var(--accent-lime)" />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button
                onClick={onStartGenerate}
                className="btn-lime"
                style={{ padding: '0.875rem 2rem', fontSize: '0.9rem' }}
              >
                Start Generating <ArrowRight size={16} />
              </button>

              <button
                onClick={onLearnMore}
                className="btn-dark"
                style={{ padding: '0.875rem 1.75rem', fontSize: '0.9rem' }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column Image Collage */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            position: 'relative',
          }}>
            {/* Primary Motion Swap Card */}
            <div style={{
              gridColumn: '1 / -1',
              borderRadius: 16,
              overflow: 'hidden',
              height: '240px',
              position: 'relative',
              border: '1px solid var(--border-default)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80"
                alt="Genjutsu motion transfer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(11,13,14,0.9) 100%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                  Target Motion Vector
                </span>
                <span className="nav-lime-pill">SWAP ACTIVE</span>
              </div>
            </div>

            {/* Secondary collage 1 */}
            <div style={{
              borderRadius: 14,
              overflow: 'hidden',
              height: '150px',
              position: 'relative',
              border: '1px solid var(--border-subtle)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
                alt="Genjutsu input scene"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                background: 'rgba(0,0,0,0.7)',
                padding: '0.15rem 0.4rem',
                borderRadius: 4,
                fontSize: '0.65rem',
                fontWeight: 700,
              }}>
                INPUT SCENE
              </div>
            </div>

            {/* Secondary collage 2 */}
            <div style={{
              borderRadius: 14,
              overflow: 'hidden',
              height: '150px',
              position: 'relative',
              border: '1px solid var(--border-lime)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
                alt="Genjutsu output result"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                background: 'var(--accent-lime)',
                color: '#000',
                padding: '0.15rem 0.4rem',
                borderRadius: 4,
                fontSize: '0.65rem',
                fontWeight: 800,
              }}>
                OUTPUT 4K
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

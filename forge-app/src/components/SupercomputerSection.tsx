'use client';

import { Sparkles, ArrowRight, Cpu, Zap, Shield, Terminal } from 'lucide-react';

interface SupercomputerSectionProps {
  onTrySupercomputer?: () => void;
}

export default function SupercomputerSection({ onTrySupercomputer }: SupercomputerSectionProps) {
  return (
    <section id="supercomputer" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #090c0a 0%, #0e1410 50%, #060907 100%)',
        border: '1px solid var(--border-lime)',
        borderRadius: 28,
        padding: 'clamp(2.5rem, 6vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 60px rgba(200, 255, 0, 0.15)',
      }}>
        {/* CSS Perspective Grid Tunnel Effect */}
        <div
          className="supercomputer-grid"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          }}
        />

        {/* Central Glow Orb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(200, 255, 0, 0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '840px',
          margin: '0 auto',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(200, 255, 0, 0.15)',
            border: '1px solid var(--border-lime)',
            padding: '0.35rem 0.85rem',
            borderRadius: 9999,
            marginBottom: '1.5rem',
          }}>
            <Cpu size={14} color="var(--accent-lime)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-lime)', fontWeight: 800, letterSpacing: '0.05em' }}>
              NEXT-GEN INFRASTRUCTURE
            </span>
          </div>

          {/* Heading */}
          <h2 className="heading-display lime-glow-text" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
            color: '#ffffff',
            lineHeight: 1.0,
            margin: '0 0 1.25rem 0',
          }}>
            SUPER<span style={{ color: 'var(--accent-lime)' }}>COMPUTER</span>
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: '0 0 2.5rem 0',
            maxWidth: '680px',
          }}>
            One superagent for your entire creative stack — infinite parallel multi-model execution in unified realtime memory.
          </p>

          {/* Floating Stats / Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            width: '100%',
            marginBottom: '2.5rem',
          }}>
            {[
              { label: 'Latency', value: '< 280ms', sub: 'Sub-second inference' },
              { label: 'Models Active', value: '42+ Models', sub: 'Wan, Kling, Sora & Flux' },
              { label: 'Resolution', value: '8K Master', sub: 'Realtime upscale' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(18, 21, 23, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding: '1.25rem',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {stat.label}
                </div>
                <div className="heading-display" style={{ fontSize: '1.5rem', color: 'var(--accent-lime)', margin: '0.25rem 0' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onTrySupercomputer}
            className="btn-lime lime-box-glow"
            style={{ padding: '1rem 2.5rem', fontSize: '1rem', borderRadius: 9999 }}
          >
            Try Supercomputer <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

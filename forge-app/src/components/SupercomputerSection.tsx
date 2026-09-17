'use client';

import { ArrowRight, Cpu, Zap, Activity } from 'lucide-react';

interface SupercomputerSectionProps {
  onTrySupercomputer?: () => void;
}

export default function SupercomputerSection({ onTrySupercomputer }: SupercomputerSectionProps) {
  return (
    <section id="supercomputer" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <div
        className="supercomputer-perspective-wrap"
        style={{
          background: 'linear-gradient(180deg, #0b0e0f 0%, #111415 50%, #090b0c 100%)',
          border: '1px solid var(--border-lime)',
          borderRadius: 28,
          padding: 'clamp(3rem, 7vw, 5.5rem) 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 50px rgba(200, 255, 0, 0.14)',
        }}
      >
        {/* 3D Perspective Grid Floor */}
        <div className="supercomputer-grid-floor" />

        {/* Central Radial Lime Glow Orb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(200, 255, 0, 0.22) 0%, rgba(200, 255, 0, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }} />

        {/* Left Floating Creative Preview Card */}
        <div
          className="float-card-left max-lg:hidden"
          style={{
            position: 'absolute',
            top: '15%',
            left: '3%',
            width: '240px',
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid var(--border-lime)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(200,255,0,0.15)',
            zIndex: 3,
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ position: 'relative', height: '170px' }}>
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
              alt="Creative superagent render"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(17,20,21,0.95) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              top: '0.6rem',
              left: '0.6rem',
              zIndex: 2,
            }}>
              <span className="badge-glass-lime" style={{ fontSize: '0.6rem' }}>
                <Zap size={10} /> MULTI-MODEL ROUTE
              </span>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Seedance + Wan 2.5</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Latency: 140ms</span>
          </div>
        </div>

        {/* Right Floating Creative Preview Card */}
        <div
          className="float-card-right max-lg:hidden"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '3%',
            width: '240px',
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid var(--border-lime)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(200,255,0,0.15)',
            zIndex: 3,
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ position: 'relative', height: '170px' }}>
            <img
              src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
              alt="Supercomputer video generation"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(17,20,21,0.95) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              top: '0.6rem',
              left: '0.6rem',
              zIndex: 2,
            }}>
              <span className="badge-lime" style={{ fontSize: '0.6rem' }}>
                <Activity size={10} /> REALTIME MEMORY
              </span>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Genjutsu Motion Swap</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Status: Active pipeline</span>
          </div>
        </div>

        {/* Central Content */}
        <div style={{
          position: 'relative',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '780px',
          margin: '0 auto',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(200, 255, 0, 0.14)',
            border: '1px solid var(--border-lime)',
            padding: '0.35rem 0.85rem',
            borderRadius: 9999,
            marginBottom: '1.25rem',
            boxShadow: '0 0 16px rgba(200, 255, 0, 0.2)',
          }}>
            <Cpu size={14} color="var(--accent-lime)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              SUPERAGENT ARCHITECTURE
            </span>
          </div>

          {/* Heading */}
          <h2 className="heading-display lime-glow-text" style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)',
            color: '#ffffff',
            lineHeight: 1.0,
            margin: '0 0 1.1rem 0',
            letterSpacing: '-0.02em',
          }}>
            SUPER<span style={{ color: 'var(--accent-lime)' }}>COMPUTER</span>
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            margin: '0 0 2.25rem 0',
            maxWidth: '660px',
            fontWeight: 500,
          }}>
            One superagent for your entire creative stack
          </p>

          {/* Floating Performance Stats Pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.875rem',
            width: '100%',
            marginBottom: '2.5rem',
          }}>
            {[
              { label: 'LATENCY', value: '< 280ms', sub: 'Sub-second inference' },
              { label: 'PARALLEL AGENTS', value: '42+ Models', sub: 'Wan, Kling, Sora & Flux' },
              { label: 'OUTPUT RESOLUTION', value: '8K Master', sub: 'Realtime upscale' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(17, 20, 21, 0.85)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 16,
                  padding: '1.1rem 1rem',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
                <div className="heading-display" style={{ fontSize: '1.4rem', color: 'var(--accent-lime)', margin: '0.25rem 0' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onTrySupercomputer}
            className="btn-lime lime-box-glow"
            style={{
              padding: '0.95rem 2.5rem',
              fontSize: '0.95rem',
              borderRadius: 9999,
              fontWeight: 800,
              letterSpacing: '0.03em',
            }}
          >
            Try Supercomputer <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}


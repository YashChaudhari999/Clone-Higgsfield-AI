'use client';

import SectionHeader from './SectionHeader';
import { MEDIA_DATA } from '@/lib/media';
import { Sparkles, Image as ImageIcon, Type } from 'lucide-react';

export default function GptImageSection() {
  const images = MEDIA_DATA.gptImages;

  return (
    <section id="gpt-image" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <SectionHeader
        badge="ACCURATE TEXT & DESIGN MODEL"
        title="GPT IMAGE 2"
        subtitle="4K images with near-perfect text rendering, vector-like legibility, and architectural precision."
      />

      {/* Grid of GPT Image 2 Posters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        {images.map((item) => (
          <div
            key={item.id}
            className="card-glass img-zoom-container"
            style={{
              position: 'relative',
              borderRadius: 18,
              overflow: 'hidden',
              height: '360px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 20%, rgba(11,13,14,0.7) 60%, rgba(11,13,14,0.96) 100%)',
              zIndex: 1,
            }} />

            {/* Tag Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              zIndex: 2,
            }}>
              <span style={{
                background: 'rgba(18, 21, 23, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-lime)',
                color: 'var(--accent-lime)',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: 9999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <Type size={11} /> {item.tag}
              </span>
            </div>

            {/* Bottom Content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <h3 className="heading-display" style={{
                fontSize: '1.25rem',
                color: '#ffffff',
                margin: 0,
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: '0.825rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.45,
              }}>
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

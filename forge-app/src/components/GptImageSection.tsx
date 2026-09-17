'use client';

import SectionHeader from './SectionHeader';
import { MEDIA_DATA } from '@/lib/media';
import { Type } from 'lucide-react';

interface GptImageSectionProps {
  onCardClick?: (item: any) => void;
}

export default function GptImageSection({ onCardClick }: GptImageSectionProps) {
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
        {images.map((item, idx) => {
          const heights = ['380px', '320px', '360px', '330px'];
          const cardHeight = heights[idx % heights.length];

          return (
            <div
              key={item.id}
              className="card-glass img-zoom-container"
              onClick={() => onCardClick?.(item)}
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                height: cardHeight,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                cursor: 'pointer',
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
                background: 'linear-gradient(180deg, rgba(9,11,12,0.05) 0%, rgba(9,11,12,0.45) 50%, rgba(9,11,12,0.96) 100%)',
                zIndex: 1,
              }} />

              {/* Tag Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 2,
              }}>
                <span className="badge-glass-lime">
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
          );
        })}
      </div>
    </section>
  );
}


'use client';

import { MEDIA_DATA } from '@/lib/media';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

interface FeaturedGridProps {
  onCardClick?: (item: any) => void;
}

export default function FeaturedGrid({ onCardClick }: FeaturedGridProps) {
  const items = MEDIA_DATA.featured;

  return (
    <section id="featured" style={{ padding: '2.5rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className="card-glass img-zoom-container"
            onClick={() => onCardClick?.(item)}
            style={{
              position: 'relative',
              height: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
            }}
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />

            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(11,13,14,0.1) 0%, rgba(11,13,14,0.6) 40%, rgba(11,13,14,0.98) 100%)',
              zIndex: 1,
            }} />

            {/* Content overlay */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  background: 'var(--accent-lime)',
                  color: '#000000',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 9999,
                  textTransform: 'uppercase',
                }}>
                  {item.badge}
                </span>
                <Sparkles size={16} color="var(--accent-lime)" />
              </div>

              <h3 className="heading-display" style={{
                fontSize: '1.5rem',
                color: '#ffffff',
                margin: 0,
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
                margin: 0,
              }}>
                {item.subtitle}
              </p>

              <div style={{ marginTop: '0.5rem' }}>
                <button className="btn-lime" style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}>
                  {item.ctaText} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

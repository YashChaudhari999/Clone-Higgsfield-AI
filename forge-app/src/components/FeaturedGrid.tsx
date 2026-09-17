'use client';

import { MEDIA_DATA } from '@/lib/media';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedGridProps {
  onCardClick?: (item: any) => void;
}

export default function FeaturedGrid({ onCardClick }: FeaturedGridProps) {
  const items = MEDIA_DATA.featured;
  const heroItem = items[0];
  const sideItems = items.slice(1);

  return (
    <section id="featured" style={{ padding: '2.5rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1.25rem',
      }}>
        {/* Main Hero Featured Card */}
        <div
          className="card-glass img-zoom-container grid-col-span-12-lg-7"
          onClick={() => onCardClick?.(heroItem)}
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            cursor: 'pointer',
            borderRadius: '20px',
          }}
        >
          {/* Background Image */}
          <img
            src={heroItem.image}
            alt={heroItem.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />

          {/* Clean Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(9,11,12,0.05) 0%, rgba(9,11,12,0.45) 45%, rgba(9,11,12,0.96) 100%)',
            zIndex: 1,
          }} />

          {/* Content overlay */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge-lime">
                {heroItem.badge}
              </span>
              <span className="badge-glass-lime">
                <Sparkles size={12} /> FEATURED MODEL
              </span>
            </div>

            <h3 className="heading-display" style={{
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {heroItem.title}
            </h3>

            <p style={{
              fontSize: '0.925rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '560px',
            }}>
              {heroItem.subtitle}
            </p>

            <div style={{ marginTop: '0.5rem' }}>
              <button className="btn-lime" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
                {heroItem.ctaText} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Stacked Cards */}
        <div style={{
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }} className="grid-col-span-12-lg-5">
          {sideItems.map((item) => (
            <div
              key={item.id}
              className="card-glass img-zoom-container"
              onClick={() => onCardClick?.(item)}
              style={{
                position: 'relative',
                minHeight: '190px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                cursor: 'pointer',
                borderRadius: '18px',
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
                  zIndex: 0,
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(9,11,12,0.1) 0%, rgba(9,11,12,0.92) 100%)',
                zIndex: 1,
              }} />

              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge-glass-lime">
                    {item.badge}
                  </span>
                </div>

                <h3 className="heading-display" style={{
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: 0,
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.35,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


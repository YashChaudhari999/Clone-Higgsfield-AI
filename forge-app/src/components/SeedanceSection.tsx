'use client';

import SectionHeader from './SectionHeader';
import { MEDIA_DATA } from '@/lib/media';
import { Play } from 'lucide-react';

interface SeedanceSectionProps {
  onCardClick?: (item: any) => void;
}

export default function SeedanceSection({ onCardClick }: SeedanceSectionProps) {
  const items = MEDIA_DATA.seedanceGrid;
  const heroItem = items[0];
  const rightItems = items.slice(1);

  return (
    <section id="seedance" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <SectionHeader
        badge="FLAGSHIP AI VIDEO MODEL"
        title="SEEDANCE 2.5"
        subtitle="The most advanced AI video model — unprecedented temporal realism, camera movement control, and lighting consistency."
      />

      {/* Editorial Grid: Varied Aspect Ratios */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
        alignItems: 'stretch',
      }}>
        {/* Left Column: Dominant Vertical Hero Card */}
        <div
          className="card-glass img-zoom-container"
          onClick={() => onCardClick?.(heroItem)}
          style={{
            minHeight: '520px',
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem',
            gridColumn: 'span 1',
            cursor: 'pointer',
          }}
        >
          <img
            src={heroItem.image}
            alt={heroItem.title}
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
            background: 'linear-gradient(180deg, transparent 30%, rgba(9,11,12,0.65) 60%, rgba(9,11,12,0.96) 100%)',
            zIndex: 1,
          }} />

          {/* Floating Top Badge */}
          <div style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 2,
          }}>
            <div className="hover-reveal-action" style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(9,11,12,0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-default)',
            }}>
              <Play size={14} color="#ffffff" fill="#ffffff" style={{ marginLeft: 1 }} />
            </div>
          </div>

          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge-glass-lime">SEEDANCE 2.5 PRO</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>60 FPS / 4K</span>
            </div>

            <h3 className="heading-display" style={{
              fontSize: '1.8rem',
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {heroItem.title}
            </h3>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {heroItem.subtitle}
            </p>
          </div>
        </div>

        {/* Right Column: 2x2 Grid of Landscape Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}>
          {rightItems.map((item) => (
            <div
              key={item.id}
              className="card-glass img-zoom-container"
              onClick={() => onCardClick?.(item)}
              style={{
                height: '248px',
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
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
                background: 'linear-gradient(180deg, transparent 20%, rgba(9,11,12,0.9) 100%)',
                zIndex: 1,
              }} />

              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}>
                <h4 className="heading-display" style={{
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  margin: 0,
                }}>
                  {item.title}
                </h4>

                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.4,
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


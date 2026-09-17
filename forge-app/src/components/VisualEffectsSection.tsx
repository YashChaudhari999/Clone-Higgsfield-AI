'use client';

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { MEDIA_DATA, MediaItem } from '@/lib/media';
import { Play, Wand2 } from 'lucide-react';

interface VisualEffectsSectionProps {
  onRecreate: (effect: MediaItem) => void;
}

export default function VisualEffectsSection({ onRecreate }: VisualEffectsSectionProps) {
  const effects = MEDIA_DATA.visualEffects;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Gravity Control', 'Acrobatic Motion', 'Elemental Fire', 'Perspective Warp', 'Scale Distortion'];

  const filteredEffects = selectedCategory === 'All' 
    ? effects 
    : effects.filter(e => e.category === selectedCategory);

  return (
    <section id="effects" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <SectionHeader
        badge="VFX ENGINE 3.0"
        title="VISUAL EFFECTS"
        subtitle="Big-budget visual effects, from explosions to surreal transformations."
      />

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        marginBottom: '2rem',
        scrollbarWidth: 'none',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="feature-pill"
            style={{
              background: selectedCategory === cat ? 'var(--accent-lime)' : undefined,
              color: selectedCategory === cat ? '#000000' : undefined,
              borderColor: selectedCategory === cat ? 'var(--accent-lime)' : undefined,
              fontWeight: selectedCategory === cat ? 700 : 500,
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Masonry / Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem',
        alignItems: 'start',
      }}>
        {filteredEffects.map((item, i) => {
          // Editorial height rhythm (varied aspect ratios)
          const heights = ['350px', '290px', '330px', '370px', '300px', '340px'];
          const cardHeight = heights[i % heights.length];

          return (
            <div
              key={item.id}
              className="card-glass img-zoom-container"
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: cardHeight,
                cursor: 'pointer',
              }}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  inset: 0,
                }}
              />

              {/* Clean Dark Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(9,11,12,0.1) 0%, rgba(9,11,12,0.45) 50%, rgba(9,11,12,0.96) 100%)',
                zIndex: 1,
              }} />

              {/* Top Category Badge & Play Button */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '1.1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span className="badge-glass">
                  {item.category}
                </span>

                <div className="hover-reveal-action" style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(9,11,12,0.7)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-default)',
                }}>
                  <Play size={13} color="#ffffff" fill="#ffffff" style={{ marginLeft: 1 }} />
                </div>
              </div>

              {/* Bottom Details & Recreate button */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                marginTop: 'auto',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                <h3 className="heading-display" style={{
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: 0,
                }}>
                  {item.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {item.model}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRecreate(item);
                    }}
                    className="btn-lime"
                    style={{
                      padding: '0.35rem 0.8rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      borderRadius: 9999,
                    }}
                  >
                    <Wand2 size={12} /> Recreate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


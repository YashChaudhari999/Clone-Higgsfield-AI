'use client';

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { MEDIA_DATA, MediaItem } from '@/lib/media';
import { Sparkles, Play, RefreshCw, Wand2 } from 'lucide-react';

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
              background: selectedCategory === cat ? 'var(--accent-lime)' : 'undefined',
              color: selectedCategory === cat ? '#000000' : 'undefined',
              borderColor: selectedCategory === cat ? 'var(--accent-lime)' : 'undefined',
              fontWeight: selectedCategory === cat ? 700 : 500,
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Masonry/Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        {filteredEffects.map((item, i) => (
          <div
            key={item.id}
            className="card-glass img-zoom-container"
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '320px',
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

            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(11,13,14,0.1) 0%, rgba(11,13,14,0.4) 50%, rgba(11,13,14,0.95) 100%)',
              zIndex: 1,
            }} />

            {/* Top Category Badge */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                background: 'rgba(18, 21, 23, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 9999,
              }}>
                {item.category}
              </span>

              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Play size={12} color="#ffffff" fill="#ffffff" style={{ marginLeft: 1 }} />
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
                fontSize: '1.15rem',
                color: '#ffffff',
                margin: 0,
              }}>
                {item.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {item.model}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRecreate(item);
                  }}
                  className="btn-lime"
                  style={{
                    padding: '0.35rem 0.75rem',
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
        ))}
      </div>
    </section>
  );
}

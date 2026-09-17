'use client';

import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { MEDIA_DATA } from '@/lib/media';

interface FeaturePillsProps {
  onSelectTag?: (tag: string) => void;
}

export default function FeaturePills({ onSelectTag }: FeaturePillsProps) {
  const tags = MEDIA_DATA.featureTags;
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleClick = (tag: string) => {
    const next = activeTag === tag ? null : tag;
    setActiveTag(next);
    if (onSelectTag) onSelectTag(tag);
  };

  return (
    <section id="features" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <SectionHeader
        badge="COMPLETE ECOSYSTEM"
        title="EXPLORE MORE AI FEATURES"
        subtitle="Discover specialized AI creative models, camera controls, format presets, and community collections."
      />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.625rem',
        justifyContent: 'flex-start',
      }}>
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleClick(tag)}
              className="feature-pill"
              style={{
                background: isActive ? 'var(--accent-lime)' : undefined,
                color: isActive ? '#000000' : undefined,
                borderColor: isActive ? 'var(--accent-lime)' : undefined,
                fontWeight: isActive ? 700 : 500,
                boxShadow: isActive ? '0 0 16px rgba(200, 255, 0, 0.3)' : undefined,
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import SectionHeader from './SectionHeader';
import { MEDIA_DATA, MediaItem } from '@/lib/media';
import { Heart, ArrowRight, Eye } from 'lucide-react';

interface CommunitySectionProps {
  onProjectClick: (project: MediaItem) => void;
}

export default function CommunitySection({ onProjectClick }: CommunitySectionProps) {
  const projects = MEDIA_DATA.communityProjects;

  return (
    <section id="explore" style={{ padding: '4rem 1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      <SectionHeader
        badge="COMMUNITY CREATIONS"
        title="EXPLORE THE INSIDE OF EVERY PROJECT"
        subtitle="See all prompts, assets, seed parameters, and how each project was created by community creators."
      />

      {/* Grid of Community Projects with Editorial Heights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
        alignItems: 'start',
      }}>
        {projects.map((item, idx) => {
          // Editorial rhythm: varied thumbnail heights
          const cardHeights = ['260px', '220px', '250px', '280px', '230px', '270px', '240px', '260px'];
          const thumbHeight = cardHeights[idx % cardHeights.length];

          return (
            <div
              key={item.id}
              className="card-glass img-zoom-container"
              onClick={() => onProjectClick(item)}
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              {/* Image Thumbnail */}
              <div style={{
                height: thumbHeight,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(9,11,12,0.1) 0%, rgba(9,11,12,0.4) 50%, rgba(9,11,12,0.92) 100%)',
                }} />

                {/* Badges on Top */}
                <div style={{
                  position: 'absolute',
                  top: '0.875rem',
                  left: '0.875rem',
                  right: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}>
                  <span className="badge-glass-lime">
                    {item.badge}
                  </span>

                  <span style={{
                    background: 'rgba(9, 11, 12, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--text-primary)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.65rem',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <Heart size={12} color="var(--accent-lime)" fill="var(--accent-lime)" />
                    {item.likes?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom Details */}
              <div style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'var(--bg-surface)',
                borderTop: '1px solid var(--border-subtle)',
              }}>
                <h3 className="heading-display" style={{
                  fontSize: '1.15rem',
                  color: '#ffffff',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {item.creator}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-lime)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <Eye size={13} /> View Prompt
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered CTA Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => onProjectClick(projects[0])}
          className="btn-lime"
          style={{ padding: '0.875rem 2.25rem', fontSize: '0.9rem' }}
        >
          Explore Community Projects <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}


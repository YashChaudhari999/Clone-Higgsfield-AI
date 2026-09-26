'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Compass, TrendingUp, Wand2, Eye, Heart, FolderPlus } from 'lucide-react';
import { MEDIA_DATA, MediaItem } from '@/lib/media';
import ProjectModal from '@/components/ProjectModal';

export default function PublicExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(null);

  const categories = ['All', 'Visual Effects', 'Film & Video', 'Architecture', 'Community'];

  const allItems: MediaItem[] = [
    ...MEDIA_DATA.communityProjects,
    ...MEDIA_DATA.visualEffects.map(v => ({
      ...v,
      likes: Math.floor(Math.random() * 5000) + 1200,
      badge: 'VFX TEMPLATE'
    }))
  ];

  const filteredItems = selectedCategory === 'All'
    ? allItems
    : selectedCategory === 'Visual Effects'
    ? MEDIA_DATA.visualEffects.map(v => ({ ...v, likes: 2400, badge: 'VFX TEMPLATE' }))
    : selectedCategory === 'Community'
    ? MEDIA_DATA.communityProjects
    : allItems.filter(i => i.model?.includes(selectedCategory) || i.category === selectedCategory);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="nav-lime-pill">CREATIVE TEMPLATES & INSPIRATION HUB</span>
          </div>
          <h1 className="heading-display" style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Compass size={32} color="var(--accent-lime)" /> CREATIVE TEMPLATE LIBRARY
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Discover prompts, briefs, and visual references. Select any template to inspect its brief and clone it directly into your workspace.
          </p>
        </div>

        {/* Categories Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '2rem',
          scrollbarWidth: 'none',
        }}>
          {categories.map(cat => (
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

        {/* Featured Banner */}
        <div style={{
          padding: '1.5rem 2rem',
          borderRadius: 20,
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0.03) 100%)',
          border: '1px solid var(--border-lime)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'var(--accent-lime-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(200,255,0,0.2)',
            }}>
              <TrendingUp size={24} color="var(--accent-lime)" />
            </div>
            <div>
              <h3 className="heading-display" style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                FEATURED TEMPLATE OF THE WEEK
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                &quot;If You Stop Loving Me, I&apos;ll Die&quot; — Cinematic VFX Creative Brief
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModalItem(MEDIA_DATA.communityProjects[0])}
            className="btn-lime"
            style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}
          >
            <FolderPlus size={15} /> Inspect & Use Template
          </button>
        </div>

        {/* Grid of Community Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="card-glass img-zoom-container"
              onClick={() => setActiveModalItem(item)}
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(11,13,14,0.92) 100%)',
                }} />
                <div style={{
                  position: 'absolute', top: '0.75rem', left: '0.75rem', right: '0.75rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{
                    background: 'rgba(18, 21, 23, 0.9)', backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-subtle)', color: 'var(--accent-lime)',
                    fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: 9999,
                  }}>
                    {item.badge || 'TEMPLATE'}
                  </span>

                  {item.likes && (
                    <span style={{
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                      color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600,
                      padding: '0.2rem 0.5rem', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      <Heart size={11} color="var(--accent-lime)" fill="var(--accent-lime)" />
                      {item.likes.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--bg-surface)' }}>
                <h3 className="heading-display" style={{
                  fontSize: '1.1rem', color: '#ffffff', margin: 0,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {item.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {'creator' in item && item.creator ? item.creator : item.model || 'Forgefield AI'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-lime)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Eye size={12} /> Inspect Template
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <ProjectModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      </main>

      <Footer />
    </div>
  );
}


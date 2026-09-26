'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, TrendingUp, Sparkles, Wand2, Eye, Heart, Film, FolderPlus, Loader2 } from 'lucide-react';
import { MEDIA_DATA, MediaItem } from '@/lib/media';
import { createProject } from '@/lib/supabase';
import ProjectModal from '@/components/ProjectModal';

export default function DashboardExplorePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);

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
    : allItems.filter(i => i.category === selectedCategory || i.badge?.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleQuickUseTemplate = async (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setCreatingId(item.id);
      const newProject = await createProject({
        name: item.title,
        description: item.prompt ? `Template Prompt: "${item.prompt}"\n\nCreative Direction: ${item.description || item.title}` : (item.description || item.title),
        category: item.category || 'Visual Effects',
        status: 'active',
        cover_image_url: item.image,
      });
      router.push(`/dashboard/projects/${newProject.id}`);
    } catch (err: any) {
      console.error('Failed to create project from template:', err);
      alert(err?.message || 'Failed to create project from template.');
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="nav-lime-pill">CREATIVE TEMPLATES & INSPIRATION HUB</span>
        </div>
        <h1 className="heading-display" style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Compass size={28} color="var(--accent-lime)" /> CREATIVE TEMPLATE LIBRARY
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Browse curated creative briefs, prompts, and visual references. Click <strong>"Use as Template"</strong> on any item to instantly spawn a new active project in your workspace!
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

      {/* Featured Banner inside Dashboard */}
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
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'var(--accent-lime-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(200,255,0,0.2)',
          }}>
            <TrendingUp size={24} color="var(--accent-lime)" />
          </div>
          <div>
            <h3 className="heading-display" style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              FEATURED TEMPLATE OF THE WEEK
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              "If You Stop Loving Me, I'll Die" — Cinematic VFX Creative Brief
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveModalItem(MEDIA_DATA.communityProjects[0])}
          className="btn-lime"
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}
        >
          <FolderPlus size={15} /> Inspect & Clone Template
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
            {/* Thumbnail */}
            <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(11,13,14,0.92) 100%)',
              }} />

              {/* Badges */}
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                right: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  background: 'rgba(18, 21, 23, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--accent-lime)',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 9999,
                }}>
                  {item.badge || 'TEMPLATE'}
                </span>

                {item.likes && (
                  <span style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(6px)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <Heart size={11} color="var(--accent-lime)" fill="var(--accent-lime)" />
                    {item.likes.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Info & Action */}
            <div style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              background: 'var(--bg-surface)',
            }}>
              <div>
                <h3 className="heading-display" style={{
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  margin: '0 0 0.2rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {'creator' in item && item.creator ? item.creator : item.model || 'Forgefield AI'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={(e) => handleQuickUseTemplate(item, e)}
                  disabled={creatingId === item.id}
                  className="btn-lime"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  {creatingId === item.id ? <Loader2 size={13} className="animate-spin-slow" /> : <FolderPlus size={13} />}
                  {creatingId === item.id ? 'Creating...' : 'Use as Template'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(item)}
                  className="btn-dark"
                  style={{ padding: '0.45rem 0.6rem', fontSize: '0.75rem' }}
                  title="View Brief Details"
                >
                  <Eye size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Details Modal */}
      <ProjectModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
}


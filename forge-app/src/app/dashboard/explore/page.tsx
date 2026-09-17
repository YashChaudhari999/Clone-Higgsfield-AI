'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, TrendingUp, Sparkles, Film, Image as ImageIcon, Play } from 'lucide-react';

const EXPLORE_ITEMS = [
  { gradient: 'linear-gradient(135deg, #1a0533 0%, #4a1a7a 100%)', label: 'Noir cityscape at midnight, rain-slicked streets', type: 'video', author: '@luna.creates', likes: 2840 },
  { gradient: 'linear-gradient(135deg, #001a2e 0%, #003d5c 100%)', label: 'Bioluminescent ocean at low tide, Milky Way above', type: 'image', author: '@ocean.vis', likes: 1920 },
  { gradient: 'linear-gradient(135deg, #1a0800 0%, #5c2500 100%)', label: 'Ember slow-motion campfire macro', type: 'video', author: '@fire.lens', likes: 3400 },
  { gradient: 'linear-gradient(135deg, #001a10 0%, #004d2e 100%)', label: 'Ancient temple reclaimed by jungle, morning fog', type: 'image', author: '@ruin_art', likes: 1780 },
  { gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a4d 100%)', label: 'Holographic data streams in a server farm', type: 'video', author: '@cyber.eye', likes: 5100 },
  { gradient: 'linear-gradient(135deg, #1a1000 0%, #4d3000 100%)', label: 'Desert lightning storm, long exposure', type: 'image', author: '@stormcreator', likes: 2210 },
  { gradient: 'linear-gradient(135deg, #1a0a1a 0%, #4d1a4d 100%)', label: 'Quantum particle collider visualization', type: 'video', author: '@sci.art', likes: 3320 },
  { gradient: 'linear-gradient(135deg, #001a1a 0%, #004d4d 100%)', label: 'Arctic fox in snowstorm, telephoto blur', type: 'image', author: '@wild.lens', likes: 4450 },
  { gradient: 'linear-gradient(135deg, #0a1a00 0%, #2e4d00 100%)', label: 'Vertical city garden at golden hour', type: 'video', author: '@green.arch', likes: 1980 },
];

const TABS = ['Trending', 'New', 'Following', 'Featured'] as const;
type Tab = typeof TABS[number];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Trending');

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Compass size={24} /> Explore
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Discover the best AI creations from the Forge community.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.625rem 1.125rem', fontSize: '0.875rem', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s', marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feature banner */}
      <div style={{
        padding: '1.5rem 2rem', borderRadius: 16, marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.03) 100%)',
        border: '1px solid rgba(255,107,53,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} color="var(--accent)" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '1rem' }}>This week's top creation</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Holographic data streams in a server farm</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} color="var(--accent)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>5,100 likes</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {EXPLORE_ITEMS.map((item, i) => (
          <Link
            key={i}
            href="/dashboard/create"
            style={{ textDecoration: 'none' }}
          >
            <div className="generation-card card-hover" style={{ cursor: 'pointer' }}>
              {/* Thumbnail */}
              <div style={{
                height: 200, background: item.gradient,
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'flex-end', padding: '0.75rem',
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  opacity: 0, transition: 'opacity 0.2s',
                }} className="play-icon">
                  {item.type === 'video' && (
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                      <Play size={18} fill="white" color="white" style={{ marginLeft: 2 }} />
                    </div>
                  )}
                </div>
                <span className="badge badge-muted" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {item.type === 'video' ? <Film size={10} /> : <ImageIcon size={10} />}
                  {item.type.toUpperCase()}
                </span>
              </div>
              <div style={{ padding: '0.875rem 1rem' }}>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '0.625rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.label}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.author}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ♥ {item.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

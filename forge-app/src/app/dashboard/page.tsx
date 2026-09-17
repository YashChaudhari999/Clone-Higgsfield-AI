'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusSquare, Clock, Zap, TrendingUp, Film, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { getAuth } from '@/lib/storage';
import { getGenerations, getThumbnailStyle } from '@/lib/storage';
import { Generation, User } from '@/lib/types';
import GenerationCard from '@/components/GenerationCard';

const PROMPT_SUGGESTIONS = [
  'Cinematic drone shot over a neon city',
  'Underwater ruins, golden light filtering down',
  'Slow motion wildfire in a dark forest',
  'Astronaut floating through a crystal cave',
];

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.user);
    setGenerations(getGenerations().slice(0, 6));
  }, []);

  const stats = {
    total: generations.length,
    videos: generations.filter(g => g.type === 'video').length,
    images: generations.filter(g => g.type === 'image').length,
    completed: generations.filter(g => g.status === 'completed').length,
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.375rem' }}>
          {user ? `Welcome back, ${user.name.split(' ')[0]} 👋` : 'Welcome back'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          What will you create today?
        </p>
      </div>

      {/* Quick create CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0.03) 100%)',
        border: '1px solid var(--border-lime)',
        borderRadius: 16, padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1.5rem', flexWrap: 'wrap',
        marginBottom: '2rem',
      }}>
        <div>
          <h2 className="heading-display" style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.375rem' }}>
            START A NEW CREATION
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Generate cinema-grade AI video or 4K images with sub-second consistency.
          </p>
        </div>
        <Link href="/dashboard/create" style={{ flexShrink: 0 }}>
          <button className="btn-lime">
            <PlusSquare size={16} /> New Creation <ArrowRight size={15} />
          </button>
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Creations', value: stats.total, icon: <Zap size={16} />, accent: true },
          { label: 'Videos', value: stats.videos, icon: <Film size={16} /> },
          { label: 'Images', value: stats.images, icon: <ImageIcon size={16} /> },
          { label: 'Completed', value: stats.completed, icon: <TrendingUp size={16} /> },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '1rem 1.25rem',
            background: s.accent ? 'rgba(200,255,0,0.08)' : 'var(--bg-surface)',
            border: `1px solid ${s.accent ? 'var(--border-lime)' : 'var(--border-subtle)'}`,
            borderRadius: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: s.accent ? 'var(--accent-lime)' : 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {s.icon}
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</span>
            </div>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: s.accent ? 'var(--accent-lime)' : 'var(--text-primary)' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Prompt suggestions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Try these prompts
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PROMPT_SUGGESTIONS.map((p, i) => (
            <Link key={i} href={`/dashboard/create?prompt=${encodeURIComponent(p)}`} style={{ textDecoration: 'none' }}>
              <button className="feature-pill" style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
                {p}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent generations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className="heading-display" style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> RECENT CREATIONS
          </h3>
          {generations.length > 0 && (
            <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--accent-lime)' }}>
                View all <ArrowRight size={14} />
              </button>
            </Link>
          )}
        </div>

        {generations.length === 0 ? (
          <div style={{
            padding: '3rem', textAlign: 'center',
            background: 'var(--bg-surface)', borderRadius: 16,
            border: '1px dashed var(--border-default)',
          }}>
            <div style={{ width: 52, height: 52, background: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Zap size={24} color="var(--accent-lime)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No creations yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Your generations will appear here once you create something.
            </p>
            <Link href="/dashboard/create">
              <button className="btn-lime">
                <PlusSquare size={16} /> Make your first creation
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {generations.map(g => (
              <GenerationCard key={g.id} generation={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

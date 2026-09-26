'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProjects, isSupabaseConfigured, getHomepageStats, HomepageStats, supabase } from '@/lib/supabase';
import { Project } from '@/lib/types';
import {
  Sparkles, PlusSquare, FolderOpen, ArrowRight, Layers,
  Compass, Database, CheckCircle2, AlertCircle, Wand2, Eye
} from 'lucide-react';

const CREATIVE_INSPIRATION = [
  {
    title: 'Neon Cyberpunk Film Brief',
    category: 'Film & Video',
    description: 'Organize visual references, shot lists, color palettes, and AI prompts for a futuristic narrative.',
    prompt: 'Neon cyber-city, rain-slicked asphalt, volumetric teal and magenta lighting, anamorphic lens 8k',
    tag: 'Trending Brief',
  },
  {
    title: 'Architectural Visualization',
    category: '3D & Environment',
    description: 'Structure client specifications, spatial layouts, material swatches, and lighting moodboards.',
    prompt: 'Minimalist brutalist concrete villa built into cliffside, ocean sunset, photorealistic architecture',
    tag: 'Popular Template',
  },
  {
    title: 'Synthwave Album Creative Direction',
    category: 'Music & Audio',
    description: 'Track artwork briefs, music video storyboards, and social promo assets in one unified project.',
    prompt: 'Retro 80s chrome grid horizon, synthwave sun rising, magenta fog, VHS distortion aesthetic',
    tag: 'Creative Kit',
  },
];

import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<HomepageStats>({
    activeProjects: 0,
    totalAssets: 0,
    totalCategories: 0,
    isConnected: false,
  });
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(isSupabaseConfigured());
    fetchData();

    // 1. Supabase Postgres Realtime Subscription for live DB changes
    const sb = supabase;
    if (sb) {
      const channel = sb
        .channel('realtime-homepage-telemetry')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          () => {
            fetchData();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'project_assets' },
          () => {
            fetchData();
          }
        )
        .subscribe();

      const handleLocalUpdate = () => fetchData();
      window.addEventListener('forgefield_data_updated', handleLocalUpdate);
      window.addEventListener('storage', handleLocalUpdate);

      return () => {
        sb.removeChannel(channel);
        window.removeEventListener('forgefield_data_updated', handleLocalUpdate);
        window.removeEventListener('storage', handleLocalUpdate);
      };
    } else {
      const handleLocalUpdate = () => fetchData();
      window.addEventListener('forgefield_data_updated', handleLocalUpdate);
      window.addEventListener('storage', handleLocalUpdate);

      return () => {
        window.removeEventListener('forgefield_data_updated', handleLocalUpdate);
        window.removeEventListener('storage', handleLocalUpdate);
      };
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectList, currentStats] = await Promise.all([
        getProjects(),
        getHomepageStats(),
      ]);
      setProjects(projectList);
      setStats(currentStats);
    } catch (err) {
      console.error('Failed to load projects/stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Sleek Navigation */}
      <Navbar />

      {/* 2. Supabase Backend Connection Banner */}
      <div style={{
        background: isConnected ? 'rgba(200, 255, 0, 0.06)' : 'rgba(255, 170, 0, 0.06)',
        borderBottom: `1px solid ${isConnected ? 'var(--border-lime)' : 'rgba(255, 170, 0, 0.3)'}`,
        padding: '0.5rem 1.5rem',
        fontSize: '0.78rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}>
        {isConnected ? (
          <>
            <CheckCircle2 size={14} color="var(--accent-lime)" />
            <span style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>
              Cloud Backend Connected: Supabase PostgreSQL & Storage Active (Realtime Subscriptions Enabled)
            </span>
          </>
        ) : (
          <>
            <AlertCircle size={14} color="#ffaa00" />
            <span style={{ color: '#ffaa00', fontWeight: 600 }}>
              Database Ready — To connect your Supabase Cloud Database, set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY in environment.
            </span>
          </>
        )}
      </div>

      <main style={{ flex: 1 }}>
        {/* 3. HERO SECTION */}
        <section style={{
          position: 'relative',
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(2rem, 4vw, 3.5rem)',
          textAlign: 'center',
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {/* Ambient Glow Orbs */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(200, 255, 0, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(40px)',
          }} />

          {/* Micro Category Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(200, 255, 0, 0.1)',
            border: '1px solid var(--border-lime)',
            padding: '0.35rem 0.9rem',
            borderRadius: 9999,
            marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(200, 255, 0, 0.15)',
          }}>
            <Sparkles size={14} color="var(--accent-lime)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CLOUD CREATIVE WORKSPACE
            </span>
          </div>

          {/* Hero H1 Headline */}
          <h1 className="heading-display" style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            lineHeight: 1.05,
            color: '#ffffff',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            maxWidth: '960px',
            margin: '0 auto 1.25rem',
          }}>
            FORGEFIELD HELPS CREATORS TURN IDEAS INTO <span style={{ color: 'var(--accent-lime)', textShadow: '0 0 30px rgba(200,255,0,0.35)' }}>ORGANIZED CREATIVE PROJECTS</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            Organize creative briefs, reference assets, and visual direction in a focused, high-performance studio workspace.
          </p>

          {/* Hero Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard/create" style={{ textDecoration: 'none' }}>
              <button className="btn-lime" style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}>
                <PlusSquare size={18} /> Create Project <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
              <button className="btn-dark" style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}>
                <FolderOpen size={18} /> View Projects ({projects.length})
              </button>
            </Link>
          </div>
        </section>

        {/* 4. USEFUL REALTIME PROJECT STATISTICS BAR */}
        <section style={{ maxWidth: 1200, margin: '0 auto 3.5rem', padding: '0 1.5rem' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: '1.25rem 1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                LIVE DATABASE TELEMETRY & STATS
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(200,255,0,0.1)', border: '1px solid var(--border-lime)', padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-lime)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-lime)', boxShadow: '0 0 8px var(--accent-lime)' }} className="animate-pulse" /> REALTIME SYNC ACTIVE
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <div style={{ padding: '0.5rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <FolderOpen size={16} color="var(--accent-lime)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active Projects</span>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-lime)', fontFamily: 'Space Grotesk', margin: 0 }}>
                  {stats.activeProjects}
                </p>
              </div>

              <div style={{ padding: '0.5rem 1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Layers size={16} color="var(--accent-lime)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Assets Stored</span>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Space Grotesk', margin: 0 }}>
                  {stats.totalAssets}
                </p>
              </div>

              <div style={{ padding: '0.5rem 1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Compass size={16} color="var(--accent-lime)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Project Categories</span>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Space Grotesk', margin: 0 }}>
                  {stats.totalCategories}
                </p>
              </div>

              <div style={{ padding: '0.5rem 1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Database size={16} color="var(--accent-lime)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Backend Persistence</span>
                </div>
                <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-lime)', fontFamily: 'Space Grotesk', margin: '0.2rem 0 0' }}>
                  {stats.isConnected ? 'Supabase DB' : 'Local Persistence'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. RECENT PROJECTS SECTION */}
        <section style={{ maxWidth: 1200, margin: '0 auto 4rem', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="heading-display" style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                RECENT CREATIVE PROJECTS
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Your organized project briefs and reference assets
              </p>
            </div>
            <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ color: 'var(--accent-lime)', fontSize: '0.85rem' }}>
                View All Projects <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading projects from database...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-default)',
              borderRadius: 16,
            }}>
              <FolderOpen size={40} color="var(--accent-lime)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>No projects created yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
                Start by creating your first organized project brief with creative direction, category, and reference files.
              </p>
              <Link href="/dashboard/create">
                <button className="btn-lime">
                  <PlusSquare size={16} /> Create First Project
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {projects.slice(0, 6).map((proj) => (
                <div key={proj.id} className="card-hover" style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="nav-lime-pill" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {proj.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(proj.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                      {proj.name}
                    </h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {proj.description || 'No description provided.'}
                    </p>
                  </div>

                  {proj.cover_image_url && (
                    <div style={{ width: '100%', height: 140, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img src={proj.cover_image_url} alt={proj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {proj.project_assets?.length || 0} Assets Stored
                    </span>
                    <Link href={`/dashboard/projects/${proj.id}`} style={{ textDecoration: 'none' }}>
                      <button className="btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', padding: '0.3rem 0.6rem' }}>
                        <Eye size={14} /> Open Project
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. CREATIVE INSPIRATION & BRIEF TEMPLATES */}
        <section style={{ maxWidth: 1200, margin: '0 auto 5rem', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Wand2 size={18} color="var(--accent-lime)" />
              <h2 className="heading-display" style={{ fontSize: '1.5rem', color: '#ffffff' }}>
                CREATIVE BRIEF INSPIRATION
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Launch projects directly with curated creative direction templates
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {CREATIVE_INSPIRATION.map((item, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 14,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }} className="card-hover">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-lime)', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <span className="nav-free-pill">{item.tag}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                  <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'monospace',
                    marginBottom: '1.25rem',
                  }}>
                    &quot;{item.prompt}&quot;
                  </div>
                </div>

                <Link href={`/dashboard/create?name=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category)}&description=${encodeURIComponent(item.description)}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-lime" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
                    Use Template to Create Project <ArrowRight size={14} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}

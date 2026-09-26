'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusSquare, FolderOpen, Clock, ArrowRight, Zap, Layers, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/lib/supabase';
import { Project } from '@/lib/types';

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Creator';

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch {
        // silently handle; user sees empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeProjects = projects.filter(p => p.status === 'active');
  const recentProjects = projects.slice(0, 3);
  const totalAssets = projects.reduce((acc, p) => acc + (p.project_assets?.length || 0), 0);
  const totalNotes = projects.reduce((acc, p) => acc + (p.project_notes?.length || 0), 0);

  return (
    <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', maxWidth: 1100, margin: '0 auto' }}>

      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#ffffff', marginBottom: '0.375rem' }}>
          WELCOME BACK, {displayName.toUpperCase()} ⚡
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Your creative workspace — pick up where you left off.
        </p>
      </div>

      {/* Quick stats from real Supabase data */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.875rem',
        marginBottom: '2rem',
      }}>
        {[
          { label: 'Total Projects', value: loading ? '—' : projects.length, icon: <FolderOpen size={16} />, accent: true },
          { label: 'Active Projects', value: loading ? '—' : activeProjects.length, icon: <Zap size={16} /> },
          { label: 'Total Assets', value: loading ? '—' : totalAssets, icon: <Layers size={16} /> },
          { label: 'Notes Written', value: loading ? '—' : totalNotes, icon: <FileText size={16} /> },
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

      {/* Primary CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,255,0,0.12) 0%, rgba(200,255,0,0.03) 100%)',
        border: '1px solid var(--border-lime)',
        borderRadius: 16, padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1.5rem', flexWrap: 'wrap',
        marginBottom: '2.5rem',
      }}>
        <div>
          <h2 className="heading-display" style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.375rem' }}>
            START A NEW PROJECT
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Define a creative brief, upload reference assets, and build your project workspace.
          </p>
        </div>
        <Link href="/dashboard/create" style={{ flexShrink: 0 }}>
          <button className="btn-lime">
            <PlusSquare size={16} /> New Project <ArrowRight size={15} />
          </button>
        </Link>
      </div>

      {/* Recent Projects */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className="heading-display" style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={17} /> RECENT PROJECTS
          </h3>
          {projects.length > 0 && (
            <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--accent-lime)' }}>
                View all <ArrowRight size={14} />
              </button>
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            Loading your projects...
          </div>
        ) : recentProjects.length === 0 ? (
          <div style={{
            padding: '3.5rem 2rem', textAlign: 'center',
            background: 'var(--bg-surface)', borderRadius: 16,
            border: '1px dashed var(--border-default)',
          }}>
            <FolderOpen size={40} color="var(--accent-lime)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Your workspace is empty</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Create your first project to start organizing your creative work.
            </p>
            <Link href="/dashboard/create">
              <button className="btn-lime"><PlusSquare size={16} /> Create First Project</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
            {recentProjects.map(proj => (
              <Link key={proj.id} href={`/dashboard/projects/${proj.id}`} style={{ textDecoration: 'none' }}>
                <div className="card-hover" style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14, padding: '1.25rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="nav-lime-pill">{proj.category}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(proj.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{proj.name}</h3>
                  <p style={{
                    color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0
                  }}>
                    {proj.description || 'No creative brief added.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span><Layers size={12} style={{ display: 'inline', marginRight: 4 }} />{proj.project_assets?.length || 0} Assets</span>
                    <span><FileText size={12} style={{ display: 'inline', marginRight: 4 }} />{proj.project_notes?.length || 0} Notes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

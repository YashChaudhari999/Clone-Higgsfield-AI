'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Trash2, PlusSquare, Film, Image as ImageIcon, Grid, List } from 'lucide-react';
import { getGenerations, deleteGeneration } from '@/lib/storage';
import { Generation, CreationType, GenerationStatus } from '@/lib/types';
import GenerationCard from '@/components/GenerationCard';

const STATUS_FILTER: { label: string; value: GenerationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Generating', value: 'generating' },
  { label: 'Failed', value: 'error' },
];

export default function ProjectsPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CreationType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<GenerationStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const load = () => setGenerations(getGenerations());

  useEffect(() => { load(); }, []);

  const filtered = generations.filter(g => {
    if (search && !g.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && g.type !== typeFilter) return false;
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this creation?')) {
      deleteGeneration(id);
      load();
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {generations.length} creation{generations.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/dashboard/create">
          <button className="btn-lime">
            <PlusSquare size={16} /> New Creation
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-base"
            placeholder="Search prompts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {(['all', 'video', 'image'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '0.5rem 0.875rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
                border: `1px solid ${typeFilter === t ? 'var(--accent-lime)' : 'var(--border-default)'}`,
                background: typeFilter === t ? 'var(--accent-lime-dim)' : 'var(--bg-surface)',
                color: typeFilter === t ? 'var(--accent-lime)' : 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
                transition: 'all 0.15s',
              }}
            >
              {t === 'video' && <Film size={13} />}
              {t === 'image' && <ImageIcon size={13} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          className="select-base"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as GenerationStatus | 'all')}
          style={{ width: 140, flex: 'none' }}
        >
          {STATUS_FILTER.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'btn-secondary' : 'btn-ghost'}
            style={{ padding: '0.5rem' }}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'btn-secondary' : 'btn-ghost'}
            style={{ padding: '0.5rem' }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '4rem 2rem', textAlign: 'center',
          background: 'var(--bg-surface)', borderRadius: 16,
          border: '1px dashed var(--border-default)',
        }}>
          <Film size={36} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {generations.length === 0 ? 'No creations yet' : 'No results found'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {generations.length === 0
              ? 'Head to Create to generate your first AI video or image.'
              : 'Try adjusting your search or filters.'}
          </p>
          {generations.length === 0 && (
            <Link href="/dashboard/create">
              <button className="btn-primary"><PlusSquare size={16} /> Create something</button>
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(g => (
            <div key={g.id} style={{ position: 'relative' }}>
              <GenerationCard generation={g} />
              <button
                onClick={e => handleDelete(g.id, e)}
                className="btn-ghost"
                title="Delete"
                style={{
                  position: 'absolute', top: 8, right: 8,
                  padding: '0.375rem', background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(4px)', borderRadius: 6,
                  color: 'var(--text-muted)', opacity: 0,
                  transition: 'opacity 0.15s',
                  zIndex: 5,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <Trash2 size={13} color="var(--error)" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(g => (
            <Link key={g.id} href={`/dashboard/create?view=${g.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1.25rem',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, transition: 'border-color 0.15s',
              }} className="card-hover">
                <div style={{
                  width: 56, height: 40, borderRadius: 6, flexShrink: 0,
                  background: 'linear-gradient(135deg, #1a0533, #4a1a7a)',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.prompt}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {g.model} · {g.type} · {new Date(g.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`badge ${g.status === 'completed' ? 'badge-success' : g.status === 'error' ? '' : 'badge-muted'}`}
                  style={{ flexShrink: 0, color: g.status === 'error' ? 'var(--error)' : undefined }}>
                  {g.status}
                </span>
                <button onClick={e => handleDelete(g.id, e)} className="btn-ghost" style={{ padding: '0.375rem', flexShrink: 0 }}>
                  <Trash2 size={14} color="var(--error)" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

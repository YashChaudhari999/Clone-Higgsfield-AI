'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, PlusSquare, FolderOpen, Trash2, ArrowRight,
  FileText, Database, Layers, LayoutGrid, List, Sparkles,
  Calendar, CheckCircle2, Clock, Filter, AlertTriangle, X, ChevronDown
} from 'lucide-react';
import {
  getProjects, deleteProject, createProject, updateProject, isSupabaseConfigured
} from '@/lib/supabase';
import { Project } from '@/lib/types';

function ProjectsWorkspace() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'assets'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isConnected, setIsConnected] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Deletion Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsConnected(isSupabaseConfigured());
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  // Seed sample creative briefs for instant evaluation
  const handleSeedSampleProjects = async () => {
    try {
      setSeeding(true);
      const sample1 = await createProject({
        name: 'Cyberpunk Cinematic Teaser',
        description: 'Atmospheric neon visual direction brief for upcoming sci-fi game trailer.',
        category: 'Film & Video',
        status: 'active',
        cover_image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      });

      const sample2 = await createProject({
        name: 'Aetheria 3D Environment Design',
        description: 'Spatial 3D asset pipeline, lighting setup, and environment mood boards.',
        category: '3D & VFX',
        status: 'active',
        cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      });

      const sample3 = await createProject({
        name: 'Aura Studio Rebrand Guidelines',
        description: 'Complete brand identity brief including color tokens, typography scales, and motion rules.',
        category: 'Brand Identity',
        status: 'completed',
        cover_image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
      });

      await loadProjects();
    } catch (err) {
      console.error('Failed to seed sample projects:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Delete Project Confirmation & Execution
  const confirmDeleteProject = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteProject(deletingId);
      setDeletingId(null);
      await loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Unique categories derived from current projects
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.category))).filter(Boolean);
  }, [projects]);

  // Overall Stats
  const totalAssets = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.project_assets?.length || 0), 0);
  }, [projects]);

  const totalNotes = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.project_notes?.length || 0), 0);
  }, [projects]);

  const activeProjectsCount = useMemo(() => {
    return projects.filter(p => p.status === 'active').length;
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const query = search.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'assets') {
          return (b.project_assets?.length || 0) - (a.project_assets?.length || 0);
        }
        return 0;
      });
  }, [projects, search, selectedCategory, selectedStatus, sortBy]);

  const handleUpdateStatus = async (projectId: string, newStatus: 'active' | 'draft' | 'completed' | 'archived', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      await updateProject(projectId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update project status:', err);
      loadProjects();
    }
  };

  const renderStatusSelector = (proj: Project) => {
    const status = proj.status || 'active';
    const isCompleted = status === 'completed';
    const isDraft = status === 'draft';
    const isArchived = status === 'archived';

    const bg = isCompleted
      ? 'rgba(34,197,94,0.15)'
      : isDraft
        ? 'rgba(245,158,11,0.15)'
        : isArchived
          ? 'rgba(156,163,175,0.15)'
          : 'rgba(200,255,0,0.14)';

    const color = isCompleted
      ? '#22c55e'
      : isDraft
        ? '#f59e0b'
        : isArchived
          ? '#9ca3af'
          : 'var(--accent-lime)';

    const border = isCompleted
      ? '1px solid rgba(34,197,94,0.4)'
      : isDraft
        ? '1px solid rgba(245,158,11,0.4)'
        : isArchived
          ? '1px solid rgba(156,163,175,0.35)'
          : '1px solid var(--border-lime)';

    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select
          value={status}
          onClick={e => e.stopPropagation()}
          onChange={e => handleUpdateStatus(proj.id, e.target.value as any, e as any)}
          style={{
            background: bg,
            color: color,
            border: border,
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '0.2rem 1.35rem 0.2rem 0.55rem',
            borderRadius: 9999,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            appearance: 'none',
            WebkitAppearance: 'none',
            outline: 'none',
            transition: 'all 0.2s ease',
            lineHeight: 1.2,
          }}
          title="Click to update project status"
        >
          <option value="active" style={{ background: '#111415', color: '#ffffff' }}>⚡ Active</option>
          <option value="completed" style={{ background: '#111415', color: '#22c55e' }}>✓ Completed</option>
          <option value="draft" style={{ background: '#111415', color: '#8B9094' }}>✎ Draft</option>
          <option value="archived" style={{ background: '#111415', color: '#62676B' }}>📦 Archived</option>
        </select>
        <ChevronDown
          size={11}
          style={{
            position: 'absolute',
            right: 6,
            pointerEvents: 'none',
            color: color,
          }}
        />
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100%', color: '#ffffff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="nav-lime-pill">CREATIVE WORKSPACE</span>
              <span style={{ fontSize: '0.75rem', color: isConnected ? 'var(--accent-lime)' : '#ffaa00', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Database size={13} /> {isConnected ? 'Supabase Live Sync' : 'Local Persistence'}
              </span>
            </div>
            <h1 className="heading-display" style={{ fontSize: '2.2rem', color: '#ffffff' }}>
              PROJECT BRIEFS & STUDIO WORK
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Manage visual concepts, creative assets, and client documentation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSeedSampleProjects}
              disabled={seeding}
              className="btn-dark"
              style={{ fontSize: '0.82rem', padding: '0.65rem 1rem' }}
              title="Seed 3 pre-built creative project briefs into your studio"
            >
              <Sparkles size={15} color="var(--accent-lime)" /> {seeding ? 'Seeding...' : 'Seed Sample Briefs'}
            </button>

            <Link href="/dashboard/create" style={{ textDecoration: 'none' }}>
              <button className="btn-lime" style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}>
                <PlusSquare size={16} /> Create Project
              </button>
            </Link>
          </div>
        </div>

        {/* Studio Stats Summary Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '1.15rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
              <span>TOTAL PROJECTS</span>
              <FolderOpen size={16} color="var(--accent-lime)" />
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{projects.length}</p>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '1.15rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
              <span>ACTIVE BRIEFS</span>
              <Clock size={16} color="#22c55e" />
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{activeProjectsCount}</p>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '1.15rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
              <span>REFERENCE ASSETS</span>
              <Layers size={16} color="var(--accent-lime)" />
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{totalAssets}</p>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '1.15rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
              <span>PROJECT NOTES</span>
              <FileText size={16} color="var(--text-secondary)" />
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{totalNotes}</p>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Sorting & View Toggle */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 14,
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Row 1: Search & Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 440 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-base"
                placeholder="Search by project title, brief description, or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40, height: 42 }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & View Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Sort By Dropdown */}
              <select
                className="select-base"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                style={{ width: 'auto', minWidth: 150, height: 42, paddingRight: 32 }}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: Alphabetical</option>
                <option value="assets">Sort: Most Assets</option>
              </select>

              {/* Grid / List Layout Switcher */}
              <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 10, padding: 3, border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.4rem 0.65rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: viewMode === 'grid' ? 'var(--accent-lime-dim)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--accent-lime)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600,
                  }}
                  title="Grid View"
                >
                  <LayoutGrid size={15} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.4rem 0.65rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: viewMode === 'list' ? 'var(--accent-lime-dim)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--accent-lime)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600,
                  }}
                  title="List View"
                >
                  <List size={15} /> List
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Status & Category Pills */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
                <Filter size={12} /> Status:
              </span>
              {['all', 'active', 'draft', 'completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  style={{
                    padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                    border: `1px solid ${selectedStatus === st ? 'var(--accent-lime)' : 'transparent'}`,
                    background: selectedStatus === st ? 'var(--accent-lime-dim)' : 'rgba(255,255,255,0.04)',
                    color: selectedStatus === st ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>Category:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                    border: `1px solid ${selectedCategory === 'all' ? 'var(--accent-lime)' : 'transparent'}`,
                    background: selectedCategory === 'all' ? 'var(--accent-lime-dim)' : 'rgba(255,255,255,0.04)',
                    color: selectedCategory === 'all' ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                      border: `1px solid ${selectedCategory === cat ? 'var(--accent-lime)' : 'transparent'}`,
                      background: selectedCategory === cat ? 'var(--accent-lime-dim)' : 'rgba(255,255,255,0.04)',
                      color: selectedCategory === cat ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: '#ffffff' }}>{filteredProjects.length}</strong> of {projects.length} project briefs
          </p>
          {(search || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedStatus('all'); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Projects Content Area */}
        {loading ? (
          /* Skeleton Loading Grid */
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr', gap: '1.25rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '1.35rem', height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: 80, height: 18, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ width: '70%', height: 22, background: 'rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 10 }} />
                  <div style={{ width: '100%', height: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 4, marginBottom: 6 }} />
                  <div style={{ width: '60%', height: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
                </div>
                <div style={{ width: '100%', height: 28, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }} />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State Card */
          <div style={{
            padding: '4.5rem 2rem', textAlign: 'center',
            background: 'var(--bg-surface)', borderRadius: 18,
            border: '1px dashed var(--border-default)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,255,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
              border: '1px solid var(--border-lime)',
            }}>
              <FolderOpen size={30} color="var(--accent-lime)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
              {projects.length === 0 ? 'No Creative Projects Created Yet' : 'No Matching Projects Found'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 460, lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {projects.length === 0
                ? 'Get started by creating your first organized project brief, or click below to populate 3 pre-built creative project samples.'
                : 'No projects match your current search query or filter selection. Try adjusting your search term or resetting your active filters.'}
            </p>

            {projects.length === 0 ? (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={handleSeedSampleProjects} disabled={seeding} className="btn-dark">
                  <Sparkles size={16} color="var(--accent-lime)" /> {seeding ? 'Seeding...' : 'Seed Sample Briefs'}
                </button>
                <Link href="/dashboard/create">
                  <button className="btn-lime"><PlusSquare size={16} /> Create New Project</button>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedStatus('all'); }}
                className="btn-lime-outline"
              >
                Clear Search Filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => router.push(`/dashboard/projects/${proj.id}`)}
                className="card-hover"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding: '1.35rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="badge-category">{proj.category}</span>
                      {renderStatusSelector(proj)}
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setDeletingId(proj.id);
                      }}
                      className="btn-ghost"
                      title="Delete project"
                      style={{ padding: '0.35rem', color: 'var(--text-muted)', borderRadius: 6 }}
                    >
                      <Trash2 size={15} color="var(--error)" />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.45rem', lineHeight: 1.3 }}>
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
                    marginBottom: '0.85rem',
                  }}>
                    {proj.description || 'No creative brief added.'}
                  </p>
                </div>

                {proj.cover_image_url && (
                  <div style={{ width: '100%', height: 145, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#000' }}>
                    <img src={proj.cover_image_url} alt={proj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span><Layers size={13} style={{ display: 'inline', marginRight: 4 }} />{proj.project_assets?.length || 0} Assets</span>
                    <span><FileText size={13} style={{ display: 'inline', marginRight: 4 }} />{proj.project_notes?.length || 0} Notes</span>
                  </div>

                  <button className="btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', padding: '0.2rem 0.4rem', fontWeight: 700 }}>
                    Open Brief <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Layout */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => router.push(`/dashboard/projects/${proj.id}`)}
                className="card-hover"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                  {proj.cover_image_url ? (
                    <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                      <img src={proj.cover_image_url} alt={proj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--bg-elevated)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                      <FolderOpen size={24} color="var(--accent-lime)" />
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{proj.name}</h3>
                      <span className="badge-category" style={{ fontSize: '0.58rem' }}>{proj.category}</span>
                      {renderStatusSelector(proj)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>
                      {proj.description || 'No creative brief added.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span><Layers size={13} style={{ display: 'inline', marginRight: 4 }} />{proj.project_assets?.length || 0} Assets</span>
                    <span><FileText size={13} style={{ display: 'inline', marginRight: 4 }} />{proj.project_notes?.length || 0} Notes</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Calendar size={12} /> {new Date(proj.created_at).toLocaleDateString()}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setDeletingId(proj.id);
                      }}
                      className="btn-ghost"
                      title="Delete project"
                      style={{ padding: '0.4rem', color: 'var(--error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="btn-lime-outline" style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>
                      View <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-App Glassmorphism Modal Deletion Confirmation */}
      {deletingId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 18, padding: '2rem', maxWidth: 420, width: '100%',
            boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--error)' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Confirm Deletion</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Are you sure you want to permanently delete this project? This will remove all linked reference assets and project notes from Supabase database.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="btn-dark"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                disabled={isDeleting}
                style={{
                  background: 'var(--error)', color: '#ffffff',
                  fontWeight: 800, fontSize: '0.85rem',
                  padding: '0.6rem 1.25rem', borderRadius: 9999, border: 'none', cursor: 'pointer',
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
      <ProjectsWorkspace />
    </Suspense>
  );
}


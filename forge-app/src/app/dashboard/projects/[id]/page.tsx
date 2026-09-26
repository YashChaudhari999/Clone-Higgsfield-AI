'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Edit3, Save, X, Trash2, Upload, FileText, Layers,
  CheckCircle2, AlertCircle, Loader2, PlusSquare, FolderOpen, Tag, Maximize2, ChevronDown,
  Eye, Film, Music, Download, ExternalLink, FileCode
} from 'lucide-react';
import {
  getProjectById, updateProject, deleteProject,
  addProjectNote, addProjectAsset, deleteProjectAsset, isSupabaseConfigured
} from '@/lib/supabase';
import { Project, ProjectAsset } from '@/lib/types';

function getAssetTypeCategory(asset: ProjectAsset): 'image' | 'video' | 'audio' | 'pdf' | 'document' {
  const url = (asset.file_url || '').toLowerCase();
  const name = (asset.name || '').toLowerCase();
  const fileType = (asset.file_type || '').toLowerCase();

  if (fileType === 'image' || url.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg|bmp|ico)($|\?)/.test(url) || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/.test(name)) {
    return 'image';
  }
  if (url.startsWith('data:video/') || /\.(mp4|webm|ogg|mov|avi|mkv)($|\?)/.test(url) || /\.(mp4|webm|ogg|mov|avi|mkv)$/.test(name)) {
    return 'video';
  }
  if (url.startsWith('data:audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)($|\?)/.test(url) || /\.(mp3|wav|ogg|m4a|aac|flac)$/.test(name)) {
    return 'audio';
  }
  if (url.startsWith('data:application/pdf') || /\.(pdf)($|\?)/.test(url) || /\.pdf$/.test(name)) {
    return 'pdf';
  }
  return 'document';
}

function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [activePreviewAsset, setActivePreviewAsset] = useState<ProjectAsset | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);


  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'draft' | 'completed' | 'archived'>('active');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Note state
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Asset state
  const [uploadingAsset, setUploadingAsset] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProjectById(id);
      if (!data) { setNotFound(true); return; }
      setProject(data);
      setEditName(data.name);
      setEditCategory(data.category);
      setEditStatus((data.status as any) || 'active');
      setEditDescription(data.description || '');
    } catch (err: any) {
      console.error('Failed to load project:', err);
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (newStatus: 'active' | 'draft' | 'completed' | 'archived') => {
    if (!project) return;
    try {
      setProject(prev => prev ? { ...prev, status: newStatus } : prev);
      setEditStatus(newStatus);
      await updateProject(project.id, { status: newStatus });
    } catch (err: any) {
      console.error('Failed to update status:', err);
      loadProject();
    }
  };

  const handleSaveEdit = async () => {
    if (!project || !editName.trim()) return;
    try {
      setSaving(true);
      setError('');
      const updated = await updateProject(project.id, {
        name: editName.trim(),
        category: editCategory,
        status: editStatus,
        description: editDescription.trim(),
      });
      if (updated) setProject(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!project || !newNote.trim()) return;
    try {
      setAddingNote(true);
      setError('');
      const note = await addProjectNote(project.id, newNote.trim());
      setProject(prev => prev ? {
        ...prev,
        project_notes: [note, ...(prev.project_notes || [])],
      } : prev);
      setNewNote('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleUploadAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !project) return;

    try {
      setUploadingAsset(true);
      setError('');

      const uploadedAssets: ProjectAsset[] = [];
      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          console.warn(`File ${file.name} exceeds 15MB size limit.`);
          continue;
        }
        const asset = await addProjectAsset(project.id, file);
        if (asset) {
          uploadedAssets.push(asset);
        }
      }

      if (uploadedAssets.length > 0) {
        setProject(prev => prev ? {
          ...prev,
          project_assets: [...uploadedAssets, ...(prev.project_assets || [])],
        } : prev);
      }
    } catch (err: any) {
      console.error('Failed to upload asset(s):', err);
      setError(err?.message || 'Failed to upload asset.');
    } finally {
      setUploadingAsset(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteAsset = async (assetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!project) return;

    const assetToDelete = project.project_assets?.find(a => a.id === assetId);
    const assetName = assetToDelete?.name || 'this asset';

    if (!confirm(`Are you sure you want to delete "${assetName}"?`)) return;

    try {
      setDeletingAssetId(assetId);
      setError('');
      await deleteProjectAsset(assetId, project.id);
      setProject(prev => prev ? {
        ...prev,
        project_assets: (prev.project_assets || []).filter(a => a.id !== assetId),
      } : prev);
      if (activePreviewAsset?.id === assetId) {
        setActivePreviewAsset(null);
      }
    } catch (err: any) {
      console.error('Failed to delete asset:', err);
      setError(err?.message || 'Failed to delete asset.');
    } finally {
      setDeletingAssetId(null);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await deleteProject(project.id);
      router.push('/dashboard/projects');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete project.');
      setDeleting(false);
    }
  };

  // ── Loading ──────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-muted)', padding: '4rem' }}>
      <Loader2 size={20} color="var(--accent-lime)" className="animate-spin-slow" />
      Loading project...
    </div>
  );

  // ── Not Found ────────────────────────────────────
  if (notFound) return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', padding: '4rem' }}>
      <FolderOpen size={48} color="var(--accent-lime)" />
      <h2 className="heading-display" style={{ fontSize: '1.5rem', color: '#ffffff' }}>Project Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 400 }}>
        This project doesn't exist or you don't have access to it.
      </p>
      <Link href="/dashboard/projects">
        <button className="btn-lime"><ArrowLeft size={16} /> Back to Projects</button>
      </Link>
    </div>
  );

  if (!project) return null;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100%', color: '#ffffff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Back nav */}
        <Link href="/dashboard/projects" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={15} /> Back to Projects
        </Link>

        {/* Error banner */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={14} /></button>
          </div>
        )}

        {/* Cover Image */}
        {project.cover_image_url && !isEditing && (
          <div style={{ width: '100%', height: 240, borderRadius: 14, overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <img src={project.cover_image_url} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Project Header */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}>
          {!isEditing ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <span className="badge-category">{project.category}</span>
                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                      {(() => {
                        const status = project.status || 'active';
                        const isCompleted = status === 'completed';
                        const isDraft = status === 'draft';
                        const isArchived = status === 'archived';

                        const statusBg = isCompleted
                          ? 'rgba(34,197,94,0.15)'
                          : isDraft
                            ? 'rgba(245,158,11,0.15)'
                            : isArchived
                              ? 'rgba(156,163,175,0.15)'
                              : 'rgba(200,255,0,0.14)';

                        const statusColor = isCompleted
                          ? '#22c55e'
                          : isDraft
                            ? '#f59e0b'
                            : isArchived
                              ? '#9ca3af'
                              : 'var(--accent-lime)';

                        const statusBorder = isCompleted
                          ? '1px solid rgba(34,197,94,0.4)'
                          : isDraft
                            ? '1px solid rgba(245,158,11,0.4)'
                            : isArchived
                              ? '1px solid rgba(156,163,175,0.35)'
                              : '1px solid var(--border-lime)';

                        return (
                          <>
                            <select
                              value={status}
                              onChange={e => handleQuickStatusChange(e.target.value as any)}
                              style={{
                                background: statusBg,
                                color: statusColor,
                                border: statusBorder,
                                fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 1.35rem 0.2rem 0.55rem', borderRadius: 9999,
                                cursor: 'pointer', textTransform: 'uppercase', appearance: 'none', WebkitAppearance: 'none',
                                outline: 'none', lineHeight: 1.2, transition: 'all 0.2s ease',
                              }}
                              title="Click to change status"
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
                                color: statusColor,
                              }}
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <h1 className="heading-display" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#ffffff', margin: 0 }}>{project.name}</h1>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => setIsEditing(true)} className="btn-dark" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={handleDelete} className="btn-ghost" disabled={deleting} style={{ padding: '0.5rem', color: 'var(--error)' }}>
                    {deleting ? <Loader2 size={15} className="animate-spin-slow" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                {project.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No creative brief added yet.</span>}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-lime)', marginBottom: '0.25rem' }}>Edit Project</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Name *</label>
                  <input className="input-base" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Project name" />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</label>
                  <input className="input-base" value={editCategory} onChange={e => setEditCategory(e.target.value)} placeholder="Category" />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Status</label>
                  <select className="select-base" value={editStatus} onChange={e => setEditStatus(e.target.value as any)}>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Creative Brief</label>
                <textarea className="input-base" rows={4} value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Describe the creative direction, tone, deliverables..." style={{ lineHeight: 1.6 }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn-ghost" onClick={() => { setIsEditing(false); setError(''); }} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                  <X size={14} /> Cancel
                </button>
                <button className="btn-lime" onClick={handleSaveEdit} disabled={saving || !editName.trim()} style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
                  {saving ? <Loader2 size={14} className="animate-spin-slow" /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Assets Section */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-lime)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                REFERENCE ASSETS <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>({project.project_assets?.length || 0})</span>
              </h2>
            </div>

            <div>
              <button
                type="button"
                className="btn-lime"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAsset}
                style={{ padding: '0.5rem 1.15rem', fontSize: '0.82rem' }}
              >
                {uploadingAsset ? <Loader2 size={15} className="animate-spin-slow" /> : <Upload size={15} />}
                {uploadingAsset ? 'Uploading Assets...' : '+ Add Asset'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json"
                onChange={handleUploadAsset}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {!project.project_assets || project.project_assets.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '3rem 1.5rem', textAlign: 'center',
                border: '2px dashed var(--border-lime)', borderRadius: 14,
                background: 'rgba(200,255,0,0.03)', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,255,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,255,0,0.03)'}
            >
              <Upload size={32} color="var(--accent-lime)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                Upload Reference Images & Assets
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
                Click to upload one or multiple reference images, graphics, videos, audio, or documents.
              </p>
              <button className="btn-dark" style={{ pointerEvents: 'none', fontSize: '0.8rem' }}>
                Browse Files
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {project.project_assets.map(asset => {
                const category = getAssetTypeCategory(asset);
                const ext = asset.name.includes('.') ? asset.name.split('.').pop()?.toUpperCase() : category.toUpperCase();

                return (
                  <div
                    key={asset.id}
                    onClick={() => setActivePreviewAsset(asset)}
                    className="card-hover"
                    style={{
                      borderRadius: 12, overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      position: 'relative',
                    }}
                    title={`Click to preview "${asset.name}"`}
                  >
                    {/* Delete Icon Overlay Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteAsset(asset.id, e)}
                      disabled={deletingAssetId === asset.id}
                      style={{
                        position: 'absolute', top: 6, right: 6, zIndex: 10,
                        background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,68,68,0.5)',
                        borderRadius: 6, width: 26, height: 26,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ef4444', cursor: 'pointer', transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; e.currentTarget.style.color = '#ef4444'; }}
                      title="Delete asset"
                    >
                      {deletingAssetId === asset.id ? <Loader2 size={12} className="animate-spin-slow" /> : <Trash2 size={12} />}
                    </button>

                    {/* Card Media Preview Area */}
                    {category === 'image' ? (
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#000000', position: 'relative' }}>
                        <img src={asset.file_url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', left: 6, bottom: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '2px 5px', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Eye size={11} color="var(--accent-lime)" />
                          <span style={{ fontSize: '0.6rem', color: 'var(--accent-lime)', fontWeight: 700 }}>PREVIEW</span>
                        </div>
                      </div>
                    ) : category === 'video' ? (
                      <div style={{ aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0d1012', padding: '0.5rem', position: 'relative' }}>
                        <Film size={30} color="var(--accent-lime)" />
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-lime)', letterSpacing: '0.05em' }}>VIDEO</span>
                      </div>
                    ) : category === 'audio' ? (
                      <div style={{ aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0d1012', padding: '0.5rem', position: 'relative' }}>
                        <Music size={30} color="var(--accent-lime)" />
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-lime)', letterSpacing: '0.05em' }}>AUDIO</span>
                      </div>
                    ) : category === 'pdf' ? (
                      <div style={{ aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0d1012', padding: '0.5rem', position: 'relative' }}>
                        <FileText size={30} color="#ef4444" />
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em' }}>PDF</span>
                      </div>
                    ) : (
                      <div style={{ aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0d1012', padding: '0.5rem', position: 'relative' }}>
                        <FileText size={32} color="var(--accent-lime)" />
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-lime)', letterSpacing: '0.05em' }}>{ext}</span>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div style={{ padding: '0.6rem 0.75rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {asset.name}
                      </p>
                      <Eye size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Universal Asset Preview Modal */}
        {activePreviewAsset && (
          <div
            onClick={() => setActivePreviewAsset(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
            }}
          >
            {/* Modal Container */}
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 900, maxHeight: '90vh',
                background: 'var(--bg-surface)', border: '1px solid var(--border-lime)',
                borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'var(--bg-elevated)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', flex: 1, minWidth: 200 }}>
                  <FileText size={18} color="var(--accent-lime)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activePreviewAsset.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-lime)', background: 'rgba(200,255,0,0.12)', border: '1px solid var(--border-lime)', padding: '0.15rem 0.5rem', borderRadius: 999, textTransform: 'uppercase', flexShrink: 0 }}>
                    {getAssetTypeCategory(activePreviewAsset)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                  <a
                    href={activePreviewAsset.file_url}
                    download={activePreviewAsset.name}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-dark"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Download size={14} /> Download / Open
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(activePreviewAsset.id)}
                    disabled={deletingAssetId === activePreviewAsset.id}
                    className="btn-ghost"
                    style={{ color: '#ef4444', padding: '0.45rem 0.9rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {deletingAssetId === activePreviewAsset.id ? <Loader2 size={14} className="animate-spin-slow" /> : <Trash2 size={14} />} Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewAsset(null)}
                    style={{
                      background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-subtle)',
                      borderRadius: '50%', width: 34, height: 34, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body Preview Content */}
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, overflow: 'auto', minHeight: 300, background: '#080a0b' }}>
                {getAssetTypeCategory(activePreviewAsset) === 'image' ? (
                  <img
                    src={activePreviewAsset.file_url}
                    alt={activePreviewAsset.name}
                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 10, border: '1px solid var(--border-subtle)' }}
                  />
                ) : getAssetTypeCategory(activePreviewAsset) === 'video' ? (
                  <video
                    src={activePreviewAsset.file_url}
                    controls
                    autoPlay
                    style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 10, border: '1px solid var(--border-subtle)' }}
                  />
                ) : getAssetTypeCategory(activePreviewAsset) === 'audio' ? (
                  <div style={{ background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 16, border: '1px solid var(--border-lime)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: 460 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,255,0,0.12)', border: '1px solid var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Music size={32} color="var(--accent-lime)" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: '#ffffff' }}>{activePreviewAsset.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audio Track</p>
                    </div>
                    <audio src={activePreviewAsset.file_url} controls autoPlay style={{ width: '100%' }} />
                  </div>
                ) : getAssetTypeCategory(activePreviewAsset) === 'pdf' ? (
                  <iframe
                    src={activePreviewAsset.file_url}
                    title={activePreviewAsset.name}
                    style={{ width: '100%', height: '70vh', borderRadius: 10, border: 'none', background: '#ffffff' }}
                  />
                ) : (
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-lime)', borderRadius: 16, padding: '2.5rem 2rem', width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 16, background: 'rgba(200,255,0,0.1)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={38} color="var(--accent-lime)" />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-lime)', background: 'rgba(200,255,0,0.15)', padding: '0.2rem 0.6rem', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {activePreviewAsset.name.includes('.') ? activePreviewAsset.name.split('.').pop()?.toUpperCase() : 'DOCUMENT'}
                      </span>
                      <h3 style={{ margin: '0.75rem 0 0.4rem', fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                        {activePreviewAsset.name}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Document asset available for download and review.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <a
                        href={activePreviewAsset.file_url}
                        download={activePreviewAsset.name}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-lime"
                        style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Download size={15} /> Download Document
                      </a>
                      {activePreviewAsset.file_url.startsWith('http') && (
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(activePreviewAsset.file_url)}&embedded=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-dark"
                          style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <ExternalLink size={15} /> Open Preview
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <FileText size={17} color="var(--accent-lime)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              NOTES <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.82rem' }}>({project.project_notes?.length || 0})</span>
            </h2>
          </div>

          {/* Add note input */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <textarea
              className="input-base"
              placeholder="Add a note — thoughts, decisions, references..."
              rows={2}
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              style={{ flex: 1, minWidth: 200, lineHeight: 1.55, fontSize: '0.875rem', resize: 'vertical' }}
            />
            <button
              className="btn-lime"
              onClick={handleAddNote}
              disabled={addingNote || !newNote.trim()}
              style={{ alignSelf: 'flex-end', padding: '0.6rem 1.2rem', fontSize: '0.85rem', flexShrink: 0 }}
            >
              {addingNote ? <Loader2 size={14} className="animate-spin-slow" /> : <PlusSquare size={14} />}
              {addingNote ? 'Adding...' : 'Add Note'}
            </button>
          </div>

          {/* Notes list */}
          {!project.project_notes || project.project_notes.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-default)', borderRadius: 10 }}>
              <FileText size={28} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No notes yet. Add a note to keep your thinking organized.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {project.project_notes.map(note => (
                <div key={note.id} style={{ padding: '0.875rem 1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 0.375rem' }}>{note.content}</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(note.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
      <ProjectDetail />
    </Suspense>
  );
}

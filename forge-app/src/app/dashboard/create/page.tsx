'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles, PlusSquare, Upload, ArrowRight, CheckCircle2,
  FolderOpen, AlertCircle, Image as ImageIcon, FileText, Tag, Loader2, Database
} from 'lucide-react';
import { createProject, isSupabaseConfigured } from '@/lib/supabase';
import Link from 'next/link';

const CATEGORIES = [
  'Film & Video',
  '3D & VFX',
  'Brand Identity',
  'Music & Audio',
  'Architecture',
  'Game Design',
  'Creative Brief',
];

function CreateProjectWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params if coming from inspiration templates
  const initialName = searchParams.get('name') || '';
  const initialCategory = searchParams.get('category') || 'Creative Brief';
  const initialDescription = searchParams.get('description') || '';

  // Form State
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(isSupabaseConfigured());
  }, []);

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size exceeds 10MB limit.');
        return;
      }
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      setError('');
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a project name.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      if (coverFile) {
        setSubmittingStep('Uploading reference asset to Supabase Storage...');
      } else {
        setSubmittingStep('Connecting to Supabase PostgreSQL database...');
      }

      const project = await createProject(
        {
          name: name.trim(),
          description: description.trim(),
          category,
          status,
        },
        coverFile
      );

      setSubmittingStep('Project saved successfully!');
      setSuccess(true);
      setCreatedProjectId(project.id);

      // Navigate to the new project's detail page
      setTimeout(() => {
        router.push(`/dashboard/projects/${project.id}`);
      }, 1200);


    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err?.message || 'Failed to create project in Supabase backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100%', color: '#ffffff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="nav-lime-pill">CREATE PROJECT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: isConnected ? 'var(--accent-lime)' : '#ffaa00' }}>
              <Database size={13} />
              <span>{isConnected ? 'Supabase Backend Connected' : 'Demo Local Mode'}</span>
            </div>
          </div>
          <h1 className="heading-display" style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            ORGANIZE A NEW CREATIVE PROJECT
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Define project briefs, visual direction, reference assets, and target objectives.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{
            background: 'rgba(200, 255, 0, 0.12)',
            border: '1px solid var(--border-lime)',
            borderRadius: 14,
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <CheckCircle2 size={24} color="var(--accent-lime)" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-lime)', marginBottom: '0.2rem' }}>
                Project Saved Successfully!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {submittingStep || 'Stored in Supabase database. Redirecting to projects...'}
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
        }}>

          {/* 1. Project Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Project Name <span style={{ color: 'var(--accent-lime)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-base"
              placeholder="e.g. Neon Cyberpunk Film Brief or Modernist Architecture Deck"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ fontSize: '1rem', padding: '0.85rem 1rem' }}
            />
          </div>

          {/* 2. Creative Category / Direction */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Creative Direction / Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: category === cat ? 700 : 500,
                    border: `1px solid ${category === cat ? 'var(--accent-lime)' : 'var(--border-default)'}`,
                    background: category === cat ? 'var(--accent-lime-dim)' : 'var(--bg-elevated)',
                    color: category === cat ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Creative Brief / Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Creative Brief & Narrative Description
            </label>
            <textarea
              className="input-base"
              placeholder="Describe the visual tone, moodboard specs, art direction, target deliverables, or prompt guidelines..."
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ lineHeight: 1.6, fontSize: '0.92rem' }}
            />
          </div>

          {/* 4. Reference Image Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Reference Image / Cover Asset (Supabase Storage)
            </label>
            <div style={{
              border: '2px dashed var(--border-default)',
              borderRadius: 12,
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--bg-elevated)',
              position: 'relative',
            }}>
              {coverPreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '100%', maxHeight: 240, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img src={coverPreview} alt="Reference preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    style={{ fontSize: '0.8rem', color: 'var(--error)' }}
                  >
                    Remove Reference Image
                  </button>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <Upload size={32} color="var(--accent-lime)" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Click to select reference image file
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Supports PNG, JPG, WEBP up to 10MB (Uploaded to Supabase Storage)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.85rem 1rem', borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444', fontSize: '0.85rem',
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '1rem' }}>
            <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
              <button type="button" className="btn-dark" style={{ padding: '0.75rem 1.5rem', fontSize: '0.88rem' }}>
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="btn-lime"
              disabled={submitting || success}
              style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', minWidth: 180, justifyContent: 'center' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin-slow" /> Saving...
                </>
              ) : (
                <>
                  <PlusSquare size={16} /> Save Project <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
      <CreateProjectWorkspace />
    </Suspense>
  );
}

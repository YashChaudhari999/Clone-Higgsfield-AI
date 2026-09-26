'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaItem } from '@/lib/media';
import { X, Copy, Check, Wand2, Sparkles, Play, Share2, PlusSquare, Loader2, FolderPlus } from 'lucide-react';
import { createProject } from '@/lib/supabase';

interface ProjectModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export default function ProjectModal({ item, onClose }: ProjectModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  if (!item) return null;

  const handleCopyPrompt = () => {
    if (item.prompt) {
      navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseAsTemplate = async () => {
    try {
      setCreating(true);
      const newProject = await createProject({
        name: item.title,
        description: item.prompt ? `Template Prompt: "${item.prompt}"\n\nCreative Direction: ${item.description || item.title}` : (item.description || item.title),
        category: item.category || 'Visual Effects',
        status: 'active',
        cover_image_url: item.image,
      });
      onClose();
      router.push(`/dashboard/projects/${newProject.id}`);
    } catch (err: any) {
      console.error('Failed to create project from template:', err);
      alert(err?.message || 'Failed to create project from template.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-lime)',
        borderRadius: 24,
        maxWidth: 900,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        boxShadow: '0 32px 64px rgba(0,0,0,0.9), 0 0 40px rgba(200, 255, 0, 0.15)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            background: 'rgba(18, 21, 23, 0.8)',
            border: '1px solid var(--border-subtle)',
            color: '#ffffff',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          className="hover:bg-white/20"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Media Preview Column */}
        <div style={{
          position: 'relative',
          minHeight: 340,
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.75rem',
            borderRadius: 9999,
            color: 'var(--accent-lime)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <Sparkles size={13} /> {item.model || 'Forgefield AI 2.5'}
          </div>
        </div>

        {/* Details Column */}
        <div style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="nav-lime-pill">{item.badge || 'PROJECT TEMPLATE'}</span>
              {item.creator && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {item.creator}</span>}
            </div>

            <h3 className="heading-display" style={{ fontSize: '1.6rem', color: '#ffffff', margin: '0 0 0.75rem 0' }}>
              {item.title}
            </h3>

            {item.prompt && (
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 12,
                padding: '1rem',
                position: 'relative',
                marginBottom: '1rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  <span>Template Brief & Prompt</span>
                  <button
                    onClick={handleCopyPrompt}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copied ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                  margin: 0,
                  fontFamily: 'monospace',
                }}>
                  "{item.prompt}"
                </p>
              </div>
            )}

            {/* Model stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.8rem',
            }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.625rem', borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Resolution</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>3840 x 2160 (4K)</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.625rem', borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Framerate</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>60 FPS Motion</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleUseAsTemplate}
              disabled={creating}
              className="btn-lime"
              style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.875rem', minWidth: 200 }}
            >
              {creating ? <Loader2 size={16} className="animate-spin-slow" /> : <FolderPlus size={16} />}
              {creating ? 'Creating Project...' : 'Use as Project Template'}
            </button>
            <button
              onClick={handleCopyPrompt}
              className="btn-dark"
              style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}
            >
              {copied ? <Check size={15} color="var(--accent-lime)" /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


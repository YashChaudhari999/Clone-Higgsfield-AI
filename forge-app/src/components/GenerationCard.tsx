'use client';

import { useRouter } from 'next/navigation';
import { Film, Image as ImageIcon, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Generation } from '@/lib/types';
import { getThumbnailStyle } from '@/lib/storage';

interface Props {
  generation: Generation;
  onClick?: () => void;
}

const STATUS_CONFIG = {
  idle:       { label: 'Queued',     color: 'var(--text-muted)',  icon: Clock },
  generating: { label: 'Generating', color: '#f59e0b',             icon: Loader2 },
  completed:  { label: 'Completed',  color: 'var(--success)',      icon: CheckCircle },
  error:      { label: 'Failed',     color: 'var(--error)',        icon: AlertCircle },
};

export default function GenerationCard({ generation, onClick }: Props) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[generation.status];
  const StatusIcon = cfg.icon;
  const isVideo = generation.type === 'video';

  const handleClick = () => {
    if (onClick) { onClick(); return; }
    router.push(`/dashboard/create?view=${generation.id}`);
  };

  return (
    <div
      className="generation-card card-hover"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 180, position: 'relative', overflow: 'hidden',
        background: getThumbnailStyle(generation.id),
      }}>
        {/* Type badge */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span className="badge badge-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem' }}>
            {isVideo ? <Film size={10} /> : <ImageIcon size={10} />}
            {generation.type.toUpperCase()}
          </span>
        </div>

        {/* Status badge */}
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '0.125rem 0.5rem', borderRadius: 4,
            fontSize: '0.65rem', fontWeight: 600,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
            color: cfg.color, border: `1px solid ${cfg.color}33`,
          }}>
            <StatusIcon size={10} className={generation.status === 'generating' ? 'animate-spin-slow' : ''} />
            {cfg.label}
          </span>
        </div>

        {/* Shimmer overlay while generating */}
        {generation.status === 'generating' && (
          <div className="animate-shimmer" style={{ position: 'absolute', inset: 0 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '0.875rem 1rem' }}>
        <p style={{
          fontSize: '0.8rem', color: 'var(--text-primary)',
          lineHeight: 1.4, marginBottom: '0.5rem',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {generation.prompt}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {generation.model}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {new Date(generation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

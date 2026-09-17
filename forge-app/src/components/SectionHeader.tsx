import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  actionText,
  onAction,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div style={{
      marginBottom: '2.5rem',
      textAlign: align,
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
    }}>
      {badge && (
        <span style={{
          background: 'rgba(200, 255, 0, 0.1)',
          color: 'var(--accent-lime)',
          border: '1px solid var(--border-lime)',
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '0.2rem 0.6rem',
          borderRadius: 9999,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
          display: 'inline-block',
        }}>
          {badge}
        </span>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: align === 'center' ? 'center' : 'space-between',
        width: '100%',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <h2 className="heading-display" style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
          color: '#ffffff',
          lineHeight: 1.05,
          margin: 0,
        }}>
          {title}
        </h2>

        {actionText && (
          <button
            onClick={onAction}
            className="btn-lime-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
          >
            {actionText}
          </button>
        )}
      </div>

      {subtitle && (
        <p style={{
          fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
          color: 'var(--text-secondary)',
          marginTop: '0.625rem',
          maxWidth: align === 'center' ? '640px' : '720px',
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface PromoBannerProps {
  onDismiss?: () => void;
  onAction?: () => void;
}

export default function PromoBanner({ onDismiss, onAction }: PromoBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      background: 'var(--accent-lime)',
      color: '#000000',
      padding: '0.5rem 1rem',
      fontSize: '0.85rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      position: 'relative',
      zIndex: 101,
      width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'rgba(0, 0, 0, 0.1)',
          padding: '0.15rem 0.5rem',
          borderRadius: 9999,
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <Sparkles size={13} color="#000" /> Special Offer
        </span>
        <span>Get an additional discount on premium plans after signing up</span>
        <button
          onClick={onAction}
          style={{
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: 9999,
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'opacity 0.2s',
          }}
          className="hover:opacity-80"
        >
          Get your discount <ArrowRight size={12} />
        </button>
      </div>

      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          color: '#000000',
          position: 'absolute',
          right: '1rem',
        }}
        title="Dismiss banner"
        aria-label="Close promotional banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}

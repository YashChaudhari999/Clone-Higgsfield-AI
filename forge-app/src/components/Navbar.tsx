'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Menu, X, Sparkles, Zap, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenGenerateModal?: () => void;
}

export default function Navbar({ onOpenAuth, onOpenGenerateModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const navLinks = [
    { label: 'Explore', href: '#explore', active: true },
    { label: 'Image', href: '#gpt-image' },
    { label: 'Video', href: '#seedance' },
    { label: 'Audio', href: '#features' },
    { label: 'MCP', href: '#features', badge: 'NEW' },
    { label: 'API', href: '#featured' },
    { label: 'ChatGPT Plugin', href: '#features' },
    { label: 'Genjutsu', href: '#genjutsu' },
    { label: 'Effects', href: '#effects' },
    { label: 'Cinema Studio', href: '#seedance' },
    { label: 'Pricing', href: '#pricing', discountBadge: 'Save 40%' },
    { label: 'Enterprise', href: '#supercomputer' },
  ];

  return (
    <nav className="sticky-nav">
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 1.25rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'var(--accent-lime)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(200, 255, 0, 0.4)',
            }}>
              <Zap size={18} color="#000000" fill="#000000" />
            </div>
            <span style={{
              fontFamily: 'Space Grotesk',
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}>
              Forge<span style={{ color: 'var(--accent-lime)' }}>field</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem',
          }} className="lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: item.active ? 700 : 500,
                  color: item.active ? 'var(--accent-lime)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
                className="hover:text-white"
              >
                {item.active && (
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-lime)',
                    boxShadow: '0 0 8px var(--accent-lime)',
                  }} />
                )}
                {item.label}

                {item.badge && (
                  <span className="nav-lime-pill">{item.badge}</span>
                )}

                {item.discountBadge && (
                  <span className="nav-discount-pill">{item.discountBadge}</span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Language Selector */}
          <div style={{ position: 'relative' }} className="hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                padding: '0.4rem 0.6rem',
                borderRadius: 6,
              }}
              className="hover:text-white hover:bg-white/5"
            >
              <Globe size={15} />
              <span>{selectedLang}</span>
              <ChevronDown size={12} />
            </button>

            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                zIndex: 10,
                minWidth: 100,
              }}>
                {['EN', 'ES', 'JA', 'ZH', 'FR', 'DE'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      background: selectedLang === lang ? 'var(--accent-lime-dim)' : 'transparent',
                      color: selectedLang === lang ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 4,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          <Link href="/auth">
            <button className="btn-dark" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
              Login
            </button>
          </Link>

          {/* Sign Up Button */}
          <Link href="/auth?mode=signup">
            <button className="btn-lime" style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}>
              Sign Up
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '0.4rem',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }} className="lg:hidden">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: item.active ? 700 : 500,
                color: item.active ? 'var(--accent-lime)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {item.active && (
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-lime)',
                  }} />
                )}
                <span>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {item.badge && <span className="nav-lime-pill">{item.badge}</span>}
                {item.discountBadge && <span className="nav-discount-pill">{item.discountBadge}</span>}
              </div>
            </a>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Link href="/auth" style={{ flex: 1 }}>
              <button className="btn-dark" style={{ width: '100%' }}>Login</button>
            </Link>
            <Link href="/auth?mode=signup" style={{ flex: 1 }}>
              <button className="btn-lime" style={{ width: '100%' }}>Sign Up</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

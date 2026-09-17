'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Menu, X, Zap, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenGenerateModal?: () => void;
}

export default function Navbar({ onOpenAuth, onOpenGenerateModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const [activeTab, setActiveTab] = useState('Explore');

  const navLinks = [
    { label: 'Explore', href: '#explore' },
    { label: 'Image', href: '#gpt-image' },
    { label: 'Video', href: '#seedance' },
    { label: 'Audio', href: '#features' },
    { label: 'MCP', href: '#features', badge: 'NEW' },
    { label: 'API', href: '#featured' },
    { label: 'ChatGPT Plugin', href: '#features' },
    { label: 'Genjutsu', href: '#genjutsu' },
    { label: 'Effects', href: '#effects', freeBadge: 'FREE' },
    { label: 'Cinema Studio', href: '#seedance' },
    { label: 'Pricing', href: '#pricing', discountBadge: '30% OFF' },
    { label: 'Enterprise', href: '#supercomputer' },
  ];

  return (
    <nav className="sticky-nav" style={{ width: '100%' }}>
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
        {/* Left: Brand Logo & Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexShrink: 0 }}>
          {/* Polished Brand Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 34,
              height: 34,
              background: 'var(--accent-lime)',
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(200, 255, 0, 0.45)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <Zap size={19} color="#000000" fill="#000000" />
            </div>
            <span style={{
              fontFamily: 'Space Grotesk',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
            }}>
              FORGE<span style={{ color: 'var(--accent-lime)' }}>FIELD</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem',
            scrollbarWidth: 'none',
          }} className="lg:flex">
            {navLinks.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveTab(item.label)}
                  className={`nav-link-item ${isActive ? 'active' : ''}`}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                  }}
                >
                  {isActive && (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--accent-lime)',
                      boxShadow: '0 0 8px var(--accent-lime)',
                      display: 'inline-block',
                      flexShrink: 0,
                    }} />
                  )}
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="nav-lime-pill">{item.badge}</span>
                  )}

                  {item.freeBadge && (
                    <span className="nav-free-pill">{item.freeBadge}</span>
                  )}

                  {item.discountBadge && (
                    <span className="nav-discount-pill">{item.discountBadge}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Actions: Language, Login & Sign Up */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }} className="hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                padding: '0.4rem 0.65rem',
                borderRadius: 8,
                transition: 'all 0.15s ease',
              }}
              className="hover:text-white hover:border-white/20"
            >
              <Globe size={14} color="var(--accent-lime)" />
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
                borderRadius: 10,
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                zIndex: 100,
                minWidth: 110,
                boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
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
                      borderRadius: 6,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <button
              className="btn-dark"
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.78rem',
                borderRadius: 9999,
                fontWeight: 600,
              }}
            >
              Login
            </button>
          </Link>

          {/* Bright Sign Up CTA */}
          <Link href="/auth?mode=signup" style={{ textDecoration: 'none' }}>
            <button
              className="btn-lime"
              style={{
                padding: '0.45rem 1.25rem',
                fontSize: '0.78rem',
                borderRadius: 9999,
                fontWeight: 800,
              }}
            >
              Sign Up
            </button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              padding: '0.45rem',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            className="lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} color="var(--accent-lime)" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '1.25rem 1.25rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
        }} className="lg:hidden">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem 1rem',
            marginBottom: '0.75rem',
          }}>
            {navLinks.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.label);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 8,
                    background: isActive ? 'var(--accent-lime-dim)' : 'rgba(255,255,255,0.03)',
                    border: isActive ? '1px solid var(--border-lime)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isActive && (
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent-lime)',
                      }} />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <div>
                    {item.badge && <span className="nav-lime-pill">{item.badge}</span>}
                    {item.freeBadge && <span className="nav-free-pill">{item.freeBadge}</span>}
                    {item.discountBadge && <span className="nav-discount-pill">{item.discountBadge}</span>}
                  </div>
                </a>
              );
            })}
          </div>

          {/* Action Buttons in Mobile Drawer */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link href="/auth" style={{ flex: 1, textDecoration: 'none' }}>
              <button className="btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
                Login
              </button>
            </Link>
            <Link href="/auth?mode=signup" style={{ flex: 1, textDecoration: 'none' }}>
              <button className="btn-lime" style={{ width: '100%', justifyContent: 'center' }}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}


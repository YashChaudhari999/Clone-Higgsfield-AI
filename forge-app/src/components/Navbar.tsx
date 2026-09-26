'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Home, FolderOpen, Compass, PlusSquare, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenGenerateModal?: () => void;
}

export default function Navbar({ onOpenAuth, onOpenGenerateModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Create', href: '/dashboard/create', icon: PlusSquare },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth?mode=signin');
  };

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Creator';

  return (
    <header className="sticky-nav" style={{ width: '100%', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(8, 8, 8, 0.85)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Left: Forgefield Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href={user ? "/dashboard" : "/"} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
              display: 'flex',
              alignItems: 'center',
            }}>
              FORGE<span style={{ color: 'var(--accent-lime)' }}>FIELD</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    style={{
                      background: isActive ? 'rgba(200, 255, 0, 0.1)' : 'transparent',
                      border: isActive ? '1px solid var(--border-lime)' : '1px solid transparent',
                      color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      padding: '0.45rem 0.9rem',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    className="hover:text-white"
                  >
                    <Icon size={15} color={isActive ? 'var(--accent-lime)' : 'currentColor'} />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/dashboard/create" style={{ textDecoration: 'none' }}>
            <button className="btn-lime" style={{ padding: '0.45rem 1.15rem', fontSize: '0.82rem', gap: '0.4rem' }}>
              <PlusSquare size={15} /> Create Project
            </button>
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/dashboard/settings" style={{ textDecoration: 'none' }} className="hidden sm:block">
                <button className="btn-dark" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', gap: '0.4rem' }}>
                  <UserIcon size={14} color="var(--accent-lime)" />
                  <span>{displayName}</span>
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-ghost hidden sm:flex"
                title="Sign Out"
                style={{ padding: '0.45rem', color: 'var(--error)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/auth?mode=signin" style={{ textDecoration: 'none' }} className="hidden sm:block">
                <button className="btn-dark" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                  Sign In
                </button>
              </Link>
              <Link href="/auth?mode=signup" style={{ textDecoration: 'none' }} className="hidden sm:block">
                <button className="btn-lime" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
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
            }}
            className="md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} color="var(--accent-lime)" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }} className="md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 8,
                  background: isActive ? 'var(--accent-lime-dim)' : 'transparent',
                  border: isActive ? '1px solid var(--border-lime)' : '1px solid transparent',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--error)', gap: '0.5rem' }}
              >
                <LogOut size={16} /> Sign Out ({displayName})
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href="/auth?mode=signin" style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn-dark" style={{ width: '100%', justifyContent: 'center' }}>Sign In</button>
                </Link>
                <Link href="/auth?mode=signup" style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn-lime" style={{ width: '100%', justifyContent: 'center' }}>Sign Up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Home, PlusSquare, FolderOpen, Compass, Settings,
  LogOut, Menu, X, CreditCard, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Create', icon: PlusSquare, href: '/dashboard/create' },
  { label: 'Projects', icon: FolderOpen, href: '/dashboard/projects' },
  { label: 'Explore', icon: Compass, href: '/dashboard/explore' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth?mode=signin');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth?mode=signin');
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div style={{
          width: 48, height: 48, background: 'var(--accent-lime)', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(200, 255, 0, 0.4)',
        }}>
          <Zap size={24} color="#000000" fill="#000000" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          <Loader2 size={18} color="var(--accent-lime)" className="animate-spin-slow" />
          <span>Verifying Studio Authentication...</span>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Creator';
  const userEmail = user.email || '';

  const SidebarContent = () => (
    <aside style={{
      width: 240, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '1.25rem 0.75rem',
      zIndex: 30,
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.5rem', marginBottom: '1.75rem' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 28, height: 28, background: 'var(--accent-lime)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(200, 255, 0, 0.4)',
          }}>
            <Zap size={15} color="#000000" fill="#000000" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
            Forge<span style={{ color: 'var(--accent-lime)' }}>field</span>
          </span>
        </Link>
      </div>

      {/* New Project CTA */}
      <Link href="/dashboard/create" style={{ textDecoration: 'none', marginBottom: '1.25rem' }}>
        <button className="btn-lime" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.625rem' }}>
          <PlusSquare size={16} /> New Project
        </button>
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', flex: 1 }}>
        {NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <button className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
                <item.icon size={17} />
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Account Info */}
      <div style={{
        padding: '0.875rem', borderRadius: 10,
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
        marginBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CreditCard size={13} /> Studio Plan
          </span>
          <span className="nav-lime-pill" style={{ fontSize: '0.65rem' }}>PRO</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Supabase Auth & Storage Connected
        </p>
      </div>

      {/* User Identity & Logout */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.625rem 0.5rem', borderRadius: 8,
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--accent-lime)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '0.875rem', fontWeight: 800, color: '#000000',
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffffff' }}>
            {displayName}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="btn-ghost"
          title="Sign out of Supabase"
          style={{ padding: '0.375rem', color: 'var(--error)', flexShrink: 0 }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <div className="max-md:hidden" style={{ flexShrink: 0, height: '100vh', position: 'sticky', top: 0 }}>
        <SidebarContent />
      </div>

      {/* Mobile Header Navigation */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        height: 56, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem',
      }} className="max-md:flex md:hidden" id="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 26, height: 26, background: 'var(--accent-lime)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="#000000" fill="#000000" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
            Forge<span style={{ color: 'var(--accent-lime)' }}>field</span>
          </span>
        </div>

        <button className="btn-ghost" style={{ padding: '0.375rem' }} onClick={() => setSidebarOpen(v => !v)}>
          {sidebarOpen ? <X size={20} color="var(--accent-lime)" /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSidebarOpen(false)}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: 280, height: '100%' }}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area (Independent Scroll) */}
      <main style={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto' }} className="max-md:pt-14">
        {children}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Home, PlusSquare, FolderOpen, Compass, Settings,
  LogOut, ChevronDown, Menu, X, CreditCard,
} from 'lucide-react';
import { getAuth, signOut } from '@/lib/storage';
import { User } from '@/lib/types';

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
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.isAuthenticated || !auth.user) {
      router.replace('/auth');
      return;
    }
    setUser(auth.user);
  }, [router]);

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--border-default)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin-slow" />
      </div>
    );
  }

  const creditPct = Math.round((1 - user.creditsUsed / user.creditsTotal) * 100);

  const SidebarContent = () => (
    <aside style={{
      width: 240, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '1.25rem 0.75rem',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.5rem', marginBottom: '1.75rem' }}>
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
      </div>

      {/* New creation CTA */}
      <Link href="/dashboard/create" style={{ textDecoration: 'none', marginBottom: '1.25rem' }}>
        <button className="btn-lime" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.625rem' }}>
          <PlusSquare size={16} /> New Creation
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

      {/* Credits */}
      <div style={{
        padding: '0.875rem', borderRadius: 10,
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
        marginBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CreditCard size={13} /> Credits
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-lime)' }}>
            {user.creditsTotal - user.creditsUsed} / {user.creditsTotal}
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--bg-base)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${creditPct}%`, background: 'var(--accent-lime)', borderRadius: 2, transition: 'width 0.5s' }} />
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
          {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'} · Resets monthly
        </p>
      </div>

      {/* User */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.625rem 0.5rem', borderRadius: 8,
        cursor: 'pointer', position: 'relative',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--accent-lime)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '0.875rem', fontWeight: 800, color: '#000000',
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="btn-ghost"
          title="Sign out"
          style={{ padding: '0.375rem', color: 'var(--text-muted)', flexShrink: 0 }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Desktop sidebar */}
      <div className="max-md:hidden">
        <SidebarContent />
      </div>

      {/* Mobile header */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        height: 56, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem',
      }} className="max-md:flex md:hidden" id="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 24, height: 24, background: 'var(--accent-lime)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#000000" fill="#000000" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
            Forge<span style={{ color: 'var(--accent-lime)' }}>field</span>
          </span>
        </div>
        <button className="btn-ghost" style={{ padding: '0.375rem' }} onClick={() => setSidebarOpen(v => !v)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: 280, height: '100%' }}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, paddingTop: 0 }} className="md:pt-0 max-md:pt-14">
        {children}
      </main>
    </div>
  );
}

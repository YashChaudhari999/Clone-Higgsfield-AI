'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Shield, CreditCard, Palette, LogOut, Save, CheckCircle, Sparkles, Check, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/supabase';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User, desc: 'Personal details & bio' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme & interface' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alerts & email preferences' },
  { id: 'account', label: 'Account & Plan', icon: CreditCard, desc: 'Subscription & credits' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ generations: true, updates: false, marketing: false });

  useEffect(() => {
    if (user) {
      setName(profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
    }
  }, [user, profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await updateUserProfile(user.id, { display_name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile in database.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth?mode=signin');
  };

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Creator';

  if (authLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} color="var(--accent-lime)" className="animate-spin-slow" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 1.5rem', maxWidth: 1040, margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        {/* Category Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(200, 255, 0, 0.12)',
          border: '1px solid var(--border-lime)',
          padding: '0.28rem 0.75rem',
          borderRadius: 9999,
          marginBottom: '0.85rem',
          boxShadow: '0 0 16px rgba(200, 255, 0, 0.15)',
        }}>
          <Sparkles size={12} color="var(--accent-lime)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PREFERENCES & ACCOUNT
          </span>
        </div>

        <h1 className="heading-display" style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#ffffff',
          lineHeight: 1.05,
          margin: '0 0 0.6rem 0',
          letterSpacing: '-0.02em',
        }}>
          SETTINGS & <span style={{ color: 'var(--accent-lime)', textShadow: '0 0 20px rgba(200,255,0,0.3)' }}>PROFILE</span>
        </h1>

        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px' }}>
          Manage your personal studio profile, system appearance, generation notifications, and subscription plan.
        </p>
      </div>

      {/* Main Settings Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '2rem',
        alignItems: 'flex-start',
      }}>
        {/* Sidebar Nav Tabs */}
        <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="lg:grid-col-span-4">
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 20,
            padding: '0.875rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
          }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 14,
                    background: isActive ? 'var(--accent-lime-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--border-lime)' : '1px solid transparent',
                    color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  className="hover:text-white hover:bg-white/5"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: isActive ? 'var(--accent-lime)' : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#000000' : 'var(--text-secondary)',
                      flexShrink: 0,
                      transition: 'background 0.2s, color 0.2s',
                    }}>
                      <Icon size={16} color={isActive ? '#000000' : 'currentColor'} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 800 : 600, display: 'block', color: isActive ? '#ffffff' : 'inherit' }}>
                        {tab.label}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', display: 'block' }}>
                        {tab.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={15} color={isActive ? 'var(--accent-lime)' : 'var(--text-muted)'} style={{ opacity: isActive ? 1 : 0.4 }} />
                </button>
              );
            })}

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

            {/* Sign Out Action Button */}
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 14,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
              className="hover:bg-red-500/15"
            >
              <LogOut size={16} color="#ef4444" />
              <span>Sign Out of Forgefield</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div style={{ gridColumn: 'span 12' }} className="lg:grid-col-span-8">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 22,
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div>
                  <h2 className="heading-display" style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.2rem 0' }}>
                    STUDIO PROFILE
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Your live creator profile fetched directly from Supabase DB.
                  </p>
                </div>
                <span className="badge-glass-lime">SUPABASE DB SYNCED</span>
              </div>

              {/* Avatar & Header Identity */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 18,
                padding: '1.25rem',
              }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-lime) 0%, #a2d400 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#000000',
                  boxShadow: '0 0 24px rgba(200, 255, 0, 0.35)',
                  flexShrink: 0,
                  fontFamily: 'Space Grotesk',
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {displayName}
                    </h3>
                    <span className="badge-lime">
                      <Zap size={10} /> PRO STUDIO
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {user?.email}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                    User ID: {user?.id}
                  </p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '0.45rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Display Name (Supabase DB profiles table)
                  </label>
                  <input
                    className="input-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter creator handle or full name"
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                    This display name is stored in your Supabase DB `profiles` table and metadata.
                  </span>
                </div>

                <div>
                  <label style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '0.45rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Account Email Address
                  </label>
                  <input
                    className="input-base"
                    type="email"
                    value={email}
                    disabled
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                    Authenticated Supabase account email address.
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div style={{ paddingTop: '0.5rem' }}>
                <button
                  className="btn-lime"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  style={{ padding: '0.75rem 1.85rem', fontSize: '0.85rem' }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin-slow" /> Saving to Supabase DB...
                    </>
                  ) : saved ? (
                    <>
                      <Check size={16} /> Profile Saved to DB!
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Profile Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 22,
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <h2 className="heading-display" style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.2rem 0' }}>
                  SYSTEM APPEARANCE
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Customize interface themes and high-contrast creative layout modes.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
              }}>
                {[
                  { name: 'Dark Mode', tag: 'ACTIVE DEFAULT', active: true, desc: '#090B0C + Neon Lime (#C8FF00)' },
                  { name: 'Light Mode', tag: 'COMING SOON', active: false, desc: 'High-contrast studio day mode' },
                  { name: 'System Preset', tag: 'AUTO MATCH', active: false, desc: 'Syncs with OS preferences' },
                ].map((item) => (
                  <div
                    key={item.name}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 16,
                      background: item.active ? 'var(--accent-lime-dim)' : 'var(--bg-elevated)',
                      border: item.active ? '1px solid var(--border-lime)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      opacity: item.active ? 1 : 0.55,
                      cursor: item.active ? 'default' : 'not-allowed',
                    }}
                  >
                    <div style={{
                      height: 70,
                      borderRadius: 10,
                      background: item.name === 'Dark Mode' ? '#090B0C' : item.name === 'Light Mode' ? '#ffffff' : '#151819',
                      border: '1px solid var(--border-default)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-lime)' }} />
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                      </div>
                      <div style={{ height: 4, width: '60%', background: 'var(--accent-lime)', borderRadius: 2 }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: item.active ? 'var(--accent-lime)' : '#ffffff' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {item.desc}
                      </span>
                    </div>

                    <div>
                      <span className={item.active ? 'badge-glass-lime' : 'badge-glass'} style={{ fontSize: '0.62rem' }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 22,
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <h2 className="heading-display" style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.2rem 0' }}>
                  NOTIFICATION PREFERENCES
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Control realtime generation alerts, model releases, and community highlights.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'generations', label: 'Project & Workspace Updates', desc: 'Alerts when collaborators update shared project briefs' },
                  { key: 'updates', label: 'Platform & Feature Updates', desc: 'New features, improvements, and workspace tools' },
                  { key: 'marketing', label: 'Inspiration & Community Highlights', desc: 'Weekly trending projects, creative templates, and workflow guides' },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.25rem',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 16,
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.2rem 0' }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      style={{
                        width: 48,
                        height: 26,
                        borderRadius: 9999,
                        border: 'none',
                        cursor: 'pointer',
                        background: notifs[item.key as keyof typeof notifs] ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.1)',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                        flexShrink: 0,
                        boxShadow: notifs[item.key as keyof typeof notifs] ? '0 0 12px rgba(200, 255, 0, 0.35)' : 'none',
                      }}
                      aria-label={`Toggle ${item.label}`}
                    >
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: notifs[item.key as keyof typeof notifs] ? '#000000' : '#ffffff',
                        position: 'absolute',
                        top: 3,
                        left: notifs[item.key as keyof typeof notifs] ? 25 : 3,
                        transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCOUNT & PLAN TAB */}
          {activeTab === 'account' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 22,
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <h2 className="heading-display" style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.2rem 0' }}>
                  WORKSPACE ACCOUNT
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Manage your Forgefield account and cloud workspace.
                </p>
              </div>

              {/* Account Info Card */}
              <div style={{
                padding: '1.75rem',
                borderRadius: 20,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>Authenticated Account</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{user?.email}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Powered by Supabase Auth</p>
                </div>
                <div style={{ height: 1, background: 'var(--border-subtle)' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>Cloud Storage</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-lime)', fontWeight: 700 }}>Supabase PostgreSQL + Storage</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your projects, assets, and notes are stored securely in the cloud.</p>
                </div>
                <div style={{ height: 1, background: 'var(--border-subtle)' }} />
                <button className="btn-ghost" onClick={handleSignOut} style={{ alignSelf: 'flex-start', color: 'var(--error)', fontSize: '0.85rem', gap: '0.5rem' }}>
                  Sign Out of Forgefield
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

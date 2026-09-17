'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Shield, CreditCard, Palette, LogOut, Save, CheckCircle } from 'lucide-react';
import { getAuth, setAuth, signOut } from '@/lib/storage';
import { User as UserType } from '@/lib/types';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account & Plan', icon: CreditCard },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ generations: true, updates: false, marketing: false });

  useEffect(() => {
    const auth = getAuth();
    if (auth.user) {
      setUser(auth.user);
      setName(auth.user.name);
      setEmail(auth.user.email);
    }
  }, []);

  const handleSaveProfile = () => {
    if (!user) return;
    const updated = { ...user, name, email };
    setUser(updated);
    setAuth({ isAuthenticated: true, user: updated });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.625rem', fontWeight: 700, marginBottom: '2rem' }}>Settings</h1>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Tab list */}
        <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{ justifyContent: 'flex-start' }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.5rem 0' }} />
          <button
            onClick={() => { signOut(); router.push('/'); }}
            className="sidebar-nav-item"
            style={{ color: 'var(--error)' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.125rem', fontWeight: 700 }}>Profile</h2>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), #ff9a70)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700, color: '#fff',
                }}>
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{user?.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: '0.375rem' }}>Display Name</label>
                  <input className="input-base" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: '0.375rem' }}>Email</label>
                  <input className="input-base" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <button className="btn-primary" onClick={handleSaveProfile} style={{ alignSelf: 'flex-start' }}>
                {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Appearance</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Forge uses a premium dark theme optimized for creative work.</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['Dark', 'Light (coming soon)', 'System'].map(theme => (
                  <div
                    key={theme}
                    style={{
                      padding: '1rem', borderRadius: 10, width: 120, textAlign: 'center', cursor: theme === 'Dark' ? 'pointer' : 'not-allowed',
                      border: `1px solid ${theme === 'Dark' ? 'var(--accent)' : 'var(--border-subtle)'}`,
                      background: theme === 'Dark' ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                      opacity: theme !== 'Dark' ? 0.5 : 1,
                    }}
                  >
                    <div style={{ width: 36, height: 24, borderRadius: 6, background: theme === 'Dark' ? '#080808' : '#fff', border: '1px solid var(--border-default)', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: theme === 'Dark' ? 'var(--accent)' : 'var(--text-secondary)' }}>{theme.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Notifications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { key: 'generations', label: 'Generation complete', desc: 'Notify when a generation finishes' },
                  { key: 'updates', label: 'Product updates', desc: 'New features and model releases' },
                  { key: 'marketing', label: 'Tips & community', desc: 'Creative tips and community highlights' },
                ].map(item => (
                  <div key={item.key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10,
                  }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.label}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: notifs[item.key as keyof typeof notifs] ? 'var(--accent)' : 'var(--bg-overlay)',
                        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 3,
                        left: notifs[item.key as keyof typeof notifs] ? 23 : 3,
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Account & Plan</h2>
              <div style={{
                padding: '1.5rem', borderRadius: 12, marginBottom: '1.25rem',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.04) 100%)',
                border: '1px solid rgba(255,107,53,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontFamily: 'Space Grotesk' }}>Pro Plan</span>
                  <span className="badge badge-accent">Active</span>
                </div>
                <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2, marginBottom: '0.625rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((1 - (user?.creditsUsed || 0) / (user?.creditsTotal || 200)) * 100)}%`, background: 'var(--accent)', borderRadius: 2 }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {(user?.creditsTotal || 200) - (user?.creditsUsed || 0)} of {user?.creditsTotal || 200} credits remaining · Resets in 18 days
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn-primary">Upgrade to Studio</button>
                <button className="btn-secondary">Manage subscription</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

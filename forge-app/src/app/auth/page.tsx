'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const { user, loading: authLoading, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const validate = () => {
    if (!email || !email.includes('@')) return 'Please enter a valid email address.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup' && !name.trim()) return 'Please enter your display name.';
    return '';
  };

  const handleDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      const { user: loggedInUser } = await signIn('xyz@8x.com', '1234568');
      if (loggedInUser) {
        router.replace('/dashboard');
        return;
      }
    } catch (err: any) {
      console.warn('Demo sign-in failed, trying fallback sign-up:', err);
      try {
        const { user: newUser } = await signUp('xyz@8x.com', '1234568', 'Demo User');
        if (newUser) {
          router.replace('/dashboard');
          return;
        }
      } catch (signupErr: any) {
        console.error('Demo sign-up fallback failed:', signupErr);
      }
      setError(err?.message || 'Demo login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationErr = validate();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'signup') {
        const { user: newUser } = await signUp(email.trim(), password, name.trim());
        if (newUser) {
          router.replace('/dashboard');
        } else {
          // If confirmation email required by Supabase auth settings
          setError('Registration submitted! Please check your email to confirm your account or sign in.');
        }
      } else {
        const { user: loggedInUser } = await signIn(email.trim(), password);
        if (loggedInUser) {
          router.replace('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setError(err?.message || 'Authentication failed. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="var(--accent-lime)" className="animate-spin-slow" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', position: 'relative',
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 550, height: 550, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,255,0,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              width: 44, height: 44, background: 'var(--accent-lime)',
              borderRadius: 10, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
              boxShadow: '0 0 20px rgba(200, 255, 0, 0.4)',
            }}>
              <Zap size={22} color="#000000" fill="#000000" />
            </div>
          </Link>
          <h1 className="heading-display" style={{ fontSize: '1.75rem', color: '#ffffff' }}>
            {mode === 'signin' ? 'WELCOME TO FORGEFIELD' : 'CREATE YOUR ACCOUNT'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
            {mode === 'signin'
              ? 'Sign in to access your AI creative studio'
              : 'Start creating organized AI projects'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 16, padding: '2rem',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>
                  Display Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="name-input"
                    type="text"
                    className="input-base"
                    placeholder="Yash Chaudhari"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ paddingLeft: 36 }}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="email-input"
                  type="email"
                  className="input-base"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 36 }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem', fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="input-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem', borderRadius: 8,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontSize: '0.85rem', lineHeight: 1.4,
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              id="submit-auth-btn"
              type="submit"
              className="btn-lime"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin-slow" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign in' : 'Create Account'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo login — only show on sign‑in tab */}
          {mode === 'signin' && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                margin: '1.25rem 0 0',
              }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or quick access</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
              </div>
              <button
                id="demo-login-btn"
                type="button"
                onClick={handleDemoLogin}
                disabled={submitting}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'rgba(200,255,0,0.06)',
                  border: '1px dashed var(--border-lime)',
                  borderRadius: 10,
                  color: 'var(--accent-lime)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,255,0,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,255,0,0.06)')}
              >
                {submitting ? <Loader2 size={16} className="animate-spin-slow" /> : '⚡'}
                Sign in as Demo User (xyz@8x.com)
              </button>
            </>
          )}


          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-lime)', fontWeight: 700, fontSize: '0.875rem' }}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
      <AuthForm />
    </Suspense>
  );
}

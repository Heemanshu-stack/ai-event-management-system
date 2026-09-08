'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, Phone, School, AlertCircle, Loader2, Sparkles, Shield, QrCode, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  
  // Sign In Form State (empty by default)
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    college: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store passkey flags for staff & admin client views
      if (data.role === 'admin') {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('staff_auth', 'true');
        router.push(data.redirectUrl || '/admin');
      } else if (data.role === 'staff') {
        sessionStorage.setItem('staff_auth', 'true');
        router.push(data.redirectUrl || '/staff');
      } else {
        router.push(redirectUrl === '/login' ? '/' : redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg('Account created successfully! Entering platform...');
      setTimeout(() => {
        router.push(redirectUrl === '/login' ? '/' : redirectUrl);
      }, 500);
    } catch (err) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        background: 'var(--bg-canvas)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Top Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
            EventPilot AI Platform Gateway
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '6px',
          }}>
            Authentication Required
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Sign in with your credentials to access events, operations, and control.
          </p>
        </div>

        {/* Card Container */}
        <div className="surface-card" style={{ padding: '32px', boxShadow: 'var(--shadow-card)' }}>
          
          {/* Mode Switch Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '20px',
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '0.875rem',
                fontWeight: activeTab === 'signin' ? 700 : 500,
                color: activeTab === 'signin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'signin' ? '2px solid var(--accent-primary)' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '0.875rem',
                fontWeight: activeTab === 'signup' ? 700 : 500,
                color: activeTab === 'signup' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'signup' ? '2px solid var(--accent-primary)' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              Create Student Account
            </button>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} autoComplete="off">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Username or Email
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Enter your username or email"
                    className="input-field"
                    value={signInData.username}
                    onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className="input-field"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', gap: '8px', justifyContent: 'center' }}
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Authenticating...' : 'Sign In & Enter Site'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sign Up Form (New Student) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="input-field"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. rahul"
                      className="input-field"
                      value={signUpData.username}
                      onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      className="input-field"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@university.edu"
                    className="input-field"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Institution / College
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi Technological University"
                    className="input-field"
                    value={signUpData.college}
                    onChange={(e) => setSignUpData({ ...signUpData, college: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    className="input-field"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', gap: '8px', justifyContent: 'center' }}
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Creating Account...' : 'Create Student Account & Enter'}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent-primary)" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


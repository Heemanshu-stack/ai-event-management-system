'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, School, AlertCircle, Loader2, Sparkles, Shield, QrCode } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: 'heemanshu20077@gmail.com',
    password: 'password123',
    fullName: '',
    phone: '',
    college: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/portal');
    } catch (err) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoStudent = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'heemanshu20077@gmail.com', password: 'password123' }),
      });
      router.push('/portal');
    } catch (e) {
      router.push('/portal');
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="surface-card" style={{ padding: '32px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isSignUp ? 'Create Student Account' : 'Student Access Portal'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isSignUp
                ? 'Sign up to register for hackathons, workshops, and manage your team badges.'
                : 'Sign in to view your Team ID, check-in status, and download certificates.'}
            </p>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {isSignUp && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Heemanshu Sharma"
                      className="input-field"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                      Institution / College
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tech Institute of AI"
                      className="input-field"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  Account Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', gap: '8px' }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </div>
          </form>

          {/* Presentation Demo Quick Access */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '10px', textAlign: 'center' }}>
              Presentation Demo Shortcuts
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handleQuickDemoStudent}
                className="btn-secondary btn-sm"
                style={{ width: '100%', gap: '6px', justifyContent: 'center' }}
              >
                <Sparkles size={14} color="var(--accent-primary)" />
                Quick Login as Demo Student
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('staff_auth', 'true');
                    router.push('/staff');
                  }}
                  className="btn-secondary btn-sm"
                  style={{ gap: '6px', justifyContent: 'center' }}
                >
                  <QrCode size={14} /> Staff Scanner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('admin_auth', 'true');
                    router.push('/admin');
                  }}
                  className="btn-secondary btn-sm"
                  style={{ gap: '6px', justifyContent: 'center' }}
                >
                  <Shield size={14} /> Admin Panel
                </button>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}>
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New participant?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create Account
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

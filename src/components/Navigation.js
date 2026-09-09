'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, User, QrCode, Shield, Layers, LogOut, Menu, X, LogIn } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('staff_auth');
    setMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  // On login page, completely hide top menu bar
  if (!pathname || pathname.startsWith('/login')) {
    return null;
  }

  // Define links with allowed roles
  const allNavLinks = [
    { href: '/', label: 'Events Matrix', icon: Calendar, roles: ['admin', 'staff', 'student'] },
    { href: '/portal', label: 'Student Portal', icon: User, roles: ['admin', 'student'] },
    { href: '/staff', label: 'Staff Scanner', icon: QrCode, roles: ['admin', 'staff'] },
    { href: '/admin', label: 'Admin Command', icon: Shield, roles: ['admin'] },
  ];

  const currentRole = currentUser?.role || 'student';
  const navLinks = allNavLinks.filter((link) => link.roles.includes(currentRole));

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '1.125rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'var(--text-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
          >
            <Layers size={16} />
          </div>
          <span>
            EventPilot <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>AI</span>
          </span>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-subtle)' : 'transparent',
                  transition: 'color 0.15s ease, background 0.15s ease',
                }}
              >
                <Icon size={15} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Active User Status & Sign Out */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background:
                    currentUser.role === 'admin'
                      ? '#FEF3C7'
                      : currentUser.role === 'staff'
                      ? '#E0E7FF'
                      : 'var(--bg-surface-subtle)',
                  color:
                    currentUser.role === 'admin'
                      ? '#92400E'
                      : currentUser.role === 'staff'
                      ? '#3730A3'
                      : 'var(--text-secondary)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {currentUser.role}: {currentUser.username || currentUser.fullName?.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary btn-sm"
                style={{ gap: '4px', padding: '5px 10px' }}
                title="Sign out of platform"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          style={{
            background: 'none',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            display: 'none', // Controlled by CSS media query
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: '#FFFFFF',
            padding: '16px 20px 24px',
            boxShadow: 'var(--shadow-modal)',
          }}
        >
          {/* User badge on mobile */}
          {currentUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Logged in as{' '}
                <span
                  style={{
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentUser.role}
                </span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentUser.username || currentUser.email}
              </span>
            </div>
          )}

          {/* Links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: isActive ? 'var(--accent-subtle)' : 'var(--bg-surface-subtle)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Action on mobile */}
          <div>
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '12px' }}
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

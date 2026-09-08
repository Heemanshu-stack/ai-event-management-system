'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, User, QrCode, Shield, Layers, LogOut } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('staff_auth');
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
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Brand */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '1.125rem',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: 'var(--text-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
          }}>
            <Layers size={16} />
          </div>
          <span>EventPilot <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>AI</span></span>
        </Link>

        {/* Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
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

        {/* Active User Status & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                padding: '3px 8px',
                borderRadius: '4px',
                background: currentUser.role === 'admin' ? '#FEF3C7' : currentUser.role === 'staff' ? '#E0E7FF' : 'var(--bg-surface-subtle)',
                color: currentUser.role === 'admin' ? '#92400E' : currentUser.role === 'staff' ? '#3730A3' : 'var(--text-secondary)',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
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
            <Link
              href="/login"
              className="btn-primary btn-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

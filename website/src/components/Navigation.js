'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, User, QrCode, Shield, Layers } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Events Matrix', icon: Calendar },
    { href: '/portal', label: 'Student Portal', icon: User },
    { href: '/staff', label: 'Staff Scanner', icon: QrCode },
    { href: '/admin', label: 'Admin Command', icon: Shield },
  ];

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

        {/* Auth status action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/login"
            className="btn-secondary btn-sm"
          >
            Student Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

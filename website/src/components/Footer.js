'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (!pathname || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: '#FFFFFF',
      padding: '40px 0',
      marginTop: '80px',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        <div>
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>EventPilot AI</strong>
          <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
            Enterprise Event Orchestration Platform • Automated Webhook Pipelines
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '24px',
        }}>
          <span>n8n Cloud Automation</span>
          <span>Google Workspace Integration</span>
          <span>Groq Llama 3.1 LLM</span>
        </div>

        <div style={{ color: 'var(--text-muted)' }}>
          © 2026 EventPilot AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

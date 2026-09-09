'use client';

import { Award, CheckCircle2, Download, Printer, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function CertificateModal({ participant, isOpen, onClose }) {
  if (!isOpen || !participant) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: '16px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Official Certificate of Participation
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Printable Canvas Box */}
        <div
          id="certificate-print-box"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: '2px solid rgba(217, 119, 6, 0.4)',
            borderRadius: '12px',
            padding: '36px 28px',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Subtle Decorative corner borders */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderTop: '2px solid #F59E0B', borderLeft: '2px solid #F59E0B' }} />
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderTop: '2px solid #F59E0B', borderRight: '2px solid #F59E0B' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderBottom: '2px solid #F59E0B', borderLeft: '2px solid #F59E0B' }} />
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderBottom: '2px solid #F59E0B', borderRight: '2px solid #F59E0B' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            <Sparkles size={13} /> Verified Completion Credential
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC', marginBottom: '6px' }}>
            EventPilot AI Credentials
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
            Certificate of Participation
          </p>

          <p style={{ fontSize: '0.875rem', color: '#CBD5E1', marginBottom: '8px' }}>
            This is proudly presented to
          </p>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FCD34D', fontFamily: 'var(--font-sans)', textTransform: 'capitalize', letterSpacing: '-0.01em', marginBottom: '8px' }}>
            {participant.fullName || 'Participant'}
          </h1>

          <p style={{ fontSize: '0.875rem', color: '#94A3B8', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            for successfully attending and participating in the <strong>{participant.eventName || 'AI Innovation Hackathon'}</strong> organized via the EventPilot AI Autonomous Event Management Architecture.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '16px', fontSize: '0.75rem', color: '#94A3B8' }}>
            <div>
              <span style={{ display: 'block', color: '#64748B' }}>Participant ID</span>
              <strong style={{ color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>{participant.participantId}</strong>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748B' }}>Team Identifier</span>
              <strong style={{ color: '#FCD34D', fontFamily: 'var(--font-mono)' }}>{participant.teamId || 'TEAM-1001'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748B' }}>Verification Status</span>
              <strong style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={12} /> Verified Check-In
              </strong>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {participant.certificateUrl ? (
            <a
              href={participant.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-accent btn-sm"
              style={{ gap: '6px' }}
            >
              <Download size={14} /> Open Drive Certificate (PDF)
            </a>
          ) : (
            <button
              type="button"
              onClick={handlePrint}
              className="btn-accent btn-sm"
              style={{ gap: '6px' }}
            >
              <Printer size={14} /> Print / Save Certificate PDF
            </button>
          )}

          <button onClick={onClose} className="btn-secondary btn-sm">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

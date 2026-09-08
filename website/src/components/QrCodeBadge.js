'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, X, Check, Shield, Loader2 } from 'lucide-react';

export default function QrCodeBadge({ participant, isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!isOpen || !participant) return;

    setRendering(true);
    const payload = JSON.stringify({
      participantId: participant.participantId,
      name: participant.fullName,
      event: participant.eventName,
      teamId: participant.teamId,
    });

    // Generate direct Data URL
    QRCode.toDataURL(payload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        setRendering(false);
      })
      .catch((err) => {
        console.error('QR toDataURL error:', err);
        setRendering(false);
      });

    // Also draw on canvas if attached
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      }).catch((e) => console.error('QR toCanvas error:', e));
    }
  }, [isOpen, participant]);

  if (!isOpen || !participant) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `EventPilot-Pass-${participant.participantId || 'pass'}.png`;
    link.href = qrDataUrl || (canvasRef.current ? canvasRef.current.toDataURL('image/png') : '');
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '28px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              OFFICIAL ENTRY PASS
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Check-In QR Badge
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Physical Badge Card Design */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-subtle)',
        }}>
          
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
            minWidth: '220px',
            minHeight: '220px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {rendering && !qrDataUrl ? (
              <Loader2 size={32} className="animate-spin" color="var(--accent-primary)" />
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Entry QR Code"
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            ) : (
              <canvas ref={canvasRef} style={{ width: '220px', height: '220px' }} />
            )}
          </div>

          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {participant.fullName}
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {participant.eventName}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'var(--bg-surface-subtle)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            border: '1px solid var(--border-subtle)',
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Participant ID</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{participant.participantId}</strong>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Assigned Team</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{participant.teamId || 'TEAM-1002'}</strong>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownload}
            className="btn-primary"
            style={{ flex: 1, gap: '8px' }}
          >
            <Download size={16} />
            Download Pass Image
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

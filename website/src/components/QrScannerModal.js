'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera, CheckCircle2, AlertTriangle, RefreshCw, Volume2 } from 'lucide-react';

export default function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [lastScan, setLastScan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const scannerRef = useRef(null);

  // Web Audio Synthesizer Chimes
  const playSound = (isSuccess) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        // High harmonic success chime
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        // Low double buzz for error/duplicate
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio context may be blocked by browser policy until interaction
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function initScanner() {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        if (!isMounted) return;

        const scanner = new Html5QrcodeScanner(
          'qr-reader-container',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            aspectRatio: 1.0,
          },
          false
        );

        scanner.render(
          async (decodedText) => {
            if (processing) return;
            setProcessing(true);

            let participantId = decodedText;
            let name = '';
            let event = '';

            try {
              const parsed = JSON.parse(decodedText);
              if (parsed.participantId) {
                participantId = parsed.participantId;
                name = parsed.name || '';
                event = parsed.event || '';
              }
            } catch (e) {
              // Raw string fallback
            }

            try {
              const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId, name, event }),
              });

              const result = await res.json();
              playSound(res.ok);

              setLastScan({
                success: res.ok,
                participantId,
                name: result.name || name || participantId,
                message: result.message || 'Check-in verified',
                timestamp: new Date().toLocaleTimeString('en-IN'),
              });

              if (onScanSuccess) {
                onScanSuccess(result);
              }
            } catch (err) {
              playSound(false);
              setLastScan({
                success: false,
                participantId,
                message: err.message || 'Network error during check-in verification',
              });
            } finally {
              setTimeout(() => setProcessing(false), 2000);
            }
          },
          () => {}
        );

        scannerRef.current = scanner;
      } catch (err) {
        setCameraError('Unable to access camera. Please verify device permissions.');
      }
    }

    initScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Camera Attendance Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {cameraError ? (
          <div style={{
            padding: '20px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}>
            <AlertTriangle size={24} style={{ margin: '0 auto 8px' }} />
            <p>{cameraError}</p>
          </div>
        ) : (
          <div>
            <div
              id="qr-reader-container"
              style={{
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#0F172A',
              }}
            />

            {/* Scan Status Feedback */}
            {lastScan && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: lastScan.success ? 'var(--status-present-bg)' : '#FEF2F2',
                border: `1px solid ${lastScan.success ? 'rgba(5, 150, 105, 0.3)' : '#FCA5A5'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {lastScan.success ? (
                    <CheckCircle2 size={20} color="var(--status-present)" />
                  ) : (
                    <AlertTriangle size={20} color="#DC2626" />
                  )}
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: lastScan.success ? 'var(--status-present)' : '#991B1B' }}>
                      {lastScan.name} ({lastScan.participantId})
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {lastScan.message}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {lastScan.timestamp}
                </span>
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Volume2 size={13} /> Audio feedback active
              </span>
              <button
                onClick={onClose}
                className="btn-secondary btn-sm"
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

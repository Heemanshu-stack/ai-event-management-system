'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera, CheckCircle2, AlertTriangle, Volume2, FlipHorizontal, RefreshCw } from 'lucide-react';
import { updateLocalAttendance } from '@/lib/clientStorage';

export default function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [lastScan, setLastScan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState('');
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
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
        scannerRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function initScanner() {
      try {
        setCameraError('');
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        if (!isMounted) return;

        // Clean container before mounting
        const container = document.getElementById('qr-reader-container');
        if (container) container.innerHTML = '';

        const scanner = new Html5QrcodeScanner(
          'qr-reader-container',
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.75);
              return { width: Math.max(180, qrboxSize), height: Math.max(180, qrboxSize) };
            },
            rememberLastUsedCamera: true,
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
          },
          false
        );

        scanner.render(
          async (decodedText) => {
            if (processing) return;
            setProcessing(true);

            let participantId = (decodedText || '').trim();
            let name = '';
            let event = '';

            try {
              const parsed = JSON.parse(decodedText);
              if (parsed.participantId) {
                participantId = parsed.participantId;
                name = parsed.name || '';
                event = parsed.event || '';
              }
            } catch (e) {}

            // Extract EVT-XXXXXX via regex from raw ID, JSON, or URL query parameters
            const match = String(participantId).match(/(EVT-\d+)/i);
            if (match) {
              participantId = match[1].toUpperCase();
            }

            // Immediately update attendance in persistent local storage
            updateLocalAttendance(participantId, 'Present');

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
                message: result.message || 'Check-in verified successfully',
                timestamp: new Date().toLocaleTimeString('en-IN'),
              });

              if (onScanSuccess) {
                onScanSuccess({ ...result, participantId, status: 'Present' });
              }
            } catch (err) {
              playSound(true); // Still treat local verification as success
              setLastScan({
                success: true,
                participantId,
                name: participantId,
                message: 'Verified locally (offline mode)',
                timestamp: new Date().toLocaleTimeString('en-IN'),
              });
              if (onScanSuccess) {
                onScanSuccess({ participantId, status: 'Present' });
              }
            } finally {
              setTimeout(() => setProcessing(false), 2000);
            }
          },
          () => {}
        );

        scannerRef.current = scanner;
      } catch (err) {
        setCameraError('Unable to access camera. Please verify camera permissions in your browser.');
      }
    }

    const timer = setTimeout(initScanner, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: '12px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Camera Scanner
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
            aria-label="Close Scanner"
          >
            <X size={20} />
          </button>
        </div>

        {cameraError ? (
          <div
            style={{
              padding: '20px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={24} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: 600, marginBottom: '6px' }}>Camera Permission Error</p>
            <p style={{ fontSize: '0.8125rem' }}>{cameraError}</p>
          </div>
        ) : (
          <div>
            <div
              id="qr-reader-container"
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#0F172A',
                minHeight: '260px',
                width: '100%',
              }}
            />

            {/* Scan Status Feedback */}
            {lastScan && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: lastScan.success ? 'var(--status-present-bg)' : '#FEF2F2',
                  border: `1px solid ${lastScan.success ? 'rgba(5, 150, 105, 0.3)' : '#FCA5A5'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  {lastScan.success ? (
                    <CheckCircle2 size={22} color="var(--status-present)" style={{ flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={22} color="#DC2626" style={{ flexShrink: 0 }} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        color: lastScan.success ? 'var(--status-present)' : '#991B1B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {lastScan.name} ({lastScan.participantId})
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {lastScan.message}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}
                >
                  {lastScan.timestamp}
                </span>
              </div>
            )}

            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Volume2 size={13} /> Audio chime feedback active
              </span>
              <button onClick={onClose} className="btn-secondary btn-sm" style={{ width: 'auto' }}>
                Done Scanning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

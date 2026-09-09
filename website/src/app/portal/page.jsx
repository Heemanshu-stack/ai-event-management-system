'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, QrCode, Award, CheckCircle2, Clock, Download, ExternalLink, Calendar, LogOut, MessageSquare, Sparkles, Search, ArrowRight, Loader2, ShieldCheck, Mail } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import QrCodeBadge from '@/components/QrCodeBadge';
import FeedbackModal from '@/components/FeedbackModal';
import { mergeRegistrations, getLocalRegistrations } from '@/lib/clientStorage';

export default function StudentPortalPage() {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const [activeQrParticipant, setActiveQrParticipant] = useState(null);
  const [activeFeedbackParticipant, setActiveFeedbackParticipant] = useState(null);

  const loadPortalData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        const userEmail = data.user?.email?.toLowerCase();
        const merged = mergeRegistrations(data.registrations || []);
        const filtered = userEmail ? merged.filter(r => r.email?.toLowerCase() === userEmail) : merged;
        setRegistrations(filtered.length > 0 ? filtered : merged);
      } else {
        const localRegs = getLocalRegistrations();
        if (localRegs.length > 0) {
          setRegistrations(localRegs);
        } else {
          window.location.href = '/login';
          return;
        }
      }
    } catch (err) {
      console.error('Error loading portal:', err);
      setRegistrations(getLocalRegistrations());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupError('');
    setLookupResult(null);

    try {
      const res = await fetch('/api/events');
      const data = res.ok ? await res.json() : { registrations: [] };
      const allRegs = mergeRegistrations(data.registrations || []);
      const query = lookupQuery.trim().toLowerCase();

      const found = allRegs.find(
        (r) =>
          r.participantId?.toLowerCase() === query ||
          r.email?.toLowerCase() === query ||
          r.teamId?.toLowerCase() === query
      );

      if (found) {
        setLookupResult(found);
      } else {
        setLookupError(`No registration pass found matching "${lookupQuery}". Please check your Participant ID or email.`);
      }
    } catch (err) {
      const allRegs = getLocalRegistrations();
      const query = lookupQuery.trim().toLowerCase();
      const found = allRegs.find(
        (r) =>
          r.participantId?.toLowerCase() === query ||
          r.email?.toLowerCase() === query ||
          r.teamId?.toLowerCase() === query
      );
      if (found) {
        setLookupResult(found);
      } else {
        setLookupError('Failed to search registrations.');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} className="animate-spin" color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500 }}>
            Synchronizing student portal & passes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 0', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container">
        
        {/* Header Strip */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                STUDENT ACCESS PORTAL
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Welcome, {user?.fullName || 'Participant'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {user?.email} {user?.college ? `• ${user.college}` : ''}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Link href="/#events-matrix" className="btn-secondary btn-sm">
              Explore Events Catalog
            </Link>
            <button onClick={handleLogout} className="btn-secondary btn-sm" style={{ gap: '6px' }}>
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Search / Pass Lookup Utility Strip */}
        <div className="surface-card" style={{ padding: '20px 24px', marginBottom: '32px', background: 'var(--bg-surface-subtle)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Instant Pass & Certificate Lookup
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Search your Participant ID (e.g. <code style={{ fontFamily: 'var(--font-mono)' }}>EVT-000001</code>) or email to pull on-screen badge.
              </p>
            </div>

            <form onSubmit={handleLookup} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '440px', minWidth: '260px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter ID, Email, or Team..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '34px', fontSize: '0.875rem' }}
                />
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <button type="submit" className="btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Lookup Pass
              </button>
            </form>
          </div>

          {lookupError && (
            <div style={{ marginTop: '12px', fontSize: '0.8125rem', color: '#DC2626', background: '#FEF2F2', padding: '6px 12px', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
              {lookupError}
            </div>
          )}

          {/* Searched Single Pass Result Card */}
          {lookupResult && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#FFFFFF',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {lookupResult.participantId} • {lookupResult.teamId || 'TEAM-1002'}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>
                  {lookupResult.fullName} – {lookupResult.eventName}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {lookupResult.email} • Status: <strong>{lookupResult.attendance || 'Present'}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveQrParticipant(lookupResult)}
                  className="btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <QrCode size={14} />
                  View QR Badge
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeedbackParticipant(lookupResult)}
                  className="btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <MessageSquare size={14} />
                  Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setLookupResult(null)}
                  className="btn-secondary btn-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Registered Events Matrix */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Your Active Event Passes & Credentials
            </h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {registrations.length} Active Registration{registrations.length !== 1 ? 's' : ''}
            </span>
          </div>

          {registrations.length === 0 ? (
            <div className="surface-card" style={{ padding: '40px', textAlign: 'center' }}>
              <Calendar size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>No Active Registrations Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px', marginBottom: '16px' }}>
                You haven&apos;t registered for any events yet. Check out upcoming workshops and hackathons!
              </p>
              <Link href="/#events-matrix" className="btn-primary">
                Browse Event Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {registrations.map((reg, idx) => (
                <div
                  key={idx}
                  className="surface-card"
                  style={{
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    alignItems: 'center',
                  }}
                >
                  {/* Event & Team Info */}
                  <div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-primary)',
                      background: 'var(--accent-subtle)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {reg.participantId || 'EVT-000002'}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '8px', marginBottom: '4px' }}>
                      {reg.eventName || 'AI Innovation Hackathon'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span>Assigned Team:</span>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {reg.teamId || 'TEAM-1002'}
                      </strong>
                    </div>
                  </div>

                  {/* Attendance Status */}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Check-In Status
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={reg.attendance || 'Present'} />
                      {reg.checkInTime && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Verified Check-in
                        </span>
                      )}
                    </div>
                  </div>

                  {/* On-Screen QR Pass Access */}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Digital Pass
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveQrParticipant(reg)}
                      className="btn-secondary btn-sm"
                      style={{ gap: '6px', width: '100%', justifyContent: 'center' }}
                    >
                      <QrCode size={14} />
                      View On-Screen QR Pass
                    </button>
                  </div>

                  {/* Certificate & In-App Feedback Action */}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Certificate & Review
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {reg.certificateSent === 'yes' ? (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--status-present)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Certificate Dispatched
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Issued upon event check-in
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveFeedbackParticipant(reg)}
                        className="btn-secondary btn-sm"
                        style={{ gap: '6px', width: '100%', justifyContent: 'center' }}
                      >
                        <MessageSquare size={13} />
                        Submit Event Feedback
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Dynamic Canvas / DataURL QR Badge Modal */}
      <QrCodeBadge
        participant={activeQrParticipant}
        isOpen={Boolean(activeQrParticipant)}
        onClose={() => setActiveQrParticipant(null)}
      />

      {/* In-Portal AI Feedback Review Modal */}
      <FeedbackModal
        participant={activeFeedbackParticipant}
        isOpen={Boolean(activeFeedbackParticipant)}
        onClose={() => setActiveFeedbackParticipant(null)}
      />
    </div>
  );
}

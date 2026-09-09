'use client';

import { useState, useEffect } from 'react';
import { Camera, QrCode, CheckCircle2, Award, Search, Users, ShieldCheck, Send, Loader2, AlertCircle, Download, Volume2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import QrScannerModal from '@/components/QrScannerModal';
import CertificateModal from '@/components/CertificateModal';
import { mergeRegistrations, updateLocalAttendance, getLocalRegistrations, clearLocalRegistrations } from '@/lib/clientStorage';

export default function StaffPortalPage() {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [manualId, setManualId] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMessage, setManualMessage] = useState(null);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [certStatus, setCertStatus] = useState(null);
  const [activeCertificateParticipant, setActiveCertificateParticipant] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('staff_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      fetchRoster();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === 'staff2026' || passkey === 'admin2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('staff_auth', 'true');
      setAuthError('');
      fetchRoster();
    } else {
      setAuthError('Invalid Staff Passkey. (Default: staff2026)');
    }
  };

  const fetchRoster = async () => {
    try {
      const res = await fetch('/api/events');
      const data = res.ok ? await res.json() : { registrations: [] };
      const merged = mergeRegistrations(data.registrations || []);
      setParticipants(merged);
    } catch (err) {
      console.error('Failed to fetch roster:', err);
      setParticipants(getLocalRegistrations());
    }
  };

  const handleClearRoster = async () => {
    if (!confirm('Are you sure you want to clear all registrations?')) return;
    clearLocalRegistrations();
    try {
      await fetch('/api/events/clear', { method: 'POST' });
    } catch (e) {}
    fetchRoster();
    alert('Roster registrations cleared successfully.');
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;

    setManualLoading(true);
    setManualMessage(null);

    const cleanId = manualId.trim().toUpperCase();
    // Update local storage immediately
    updateLocalAttendance(cleanId, 'Present');

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: cleanId }),
      });

      const data = await res.json();
      setManualMessage({
        success: true,
        text: data.message || `Check-in updated for ${cleanId}`,
      });

      setManualId('');
      fetchRoster();
    } catch (err) {
      setManualMessage({ success: true, text: `Verified locally: ${cleanId}` });
      setManualId('');
      fetchRoster();
    } finally {
      setManualLoading(false);
    }
  };

  const handleTriggerCertificates = async () => {
    setCertLoading(true);
    setCertStatus(null);

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
      });
      const data = await res.json();
      setCertStatus({
        success: res.ok,
        message: data.message || 'Certificates batch dispatched via n8n automation pipeline.',
      });
      fetchRoster();
    } catch (err) {
      setCertStatus({ success: false, message: 'Failed to trigger certificate workflow' });
    } finally {
      setCertLoading(false);
    }
  };

  const exportRosterCsv = () => {
    const headers = ['ParticipantID', 'Name', 'Email', 'TeamID', 'Event', 'Attendance', 'CheckInTime', 'CertificateSent'];
    const rows = participants.map((p) => [
      p.participantId || '',
      `"${p.fullName || ''}"`,
      p.email || '',
      p.teamId || '',
      `"${p.eventName || ''}"`,
      p.attendance || 'Pending',
      p.checkInTime || '',
      p.certificateSent || 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EventPilot_Attendance_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 0', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div className="surface-card" style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--bg-surface-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <ShieldCheck size={22} />
              </div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Staff Terminal Access</h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Enter operational staff passkey to access camera QR scanner and live check-in console.
              </p>
            </div>

            {authError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                marginBottom: '14px',
              }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  Staff Passkey
                </label>
                <input
                  type="password"
                  placeholder="Enter staff passkey"
                  className="input-field"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Demo passkey: <code style={{ fontFamily: 'var(--font-mono)' }}>staff2026</code>
                </span>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Unlock Staff Terminal
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = (
      (p.participantId && p.participantId.toLowerCase().includes(q)) ||
      (p.fullName && p.fullName.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.teamId && p.teamId.toLowerCase().includes(q))
    );

    if (!matchesQuery) return false;
    if (statusFilter === 'Present') return (p.attendance || '').toLowerCase() === 'present';
    if (statusFilter === 'Pending') return (p.attendance || '').toLowerCase() !== 'present';
    return true;
  });

  const presentCount = participants.filter((p) => (p.attendance || '').toLowerCase() === 'present').length;

  return (
    <div style={{ padding: '48px 0', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container">
        
        {/* Top Control Bar */}
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
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              OPERATIONS TERMINAL
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Staff Attendance & Check-In Console
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="btn-accent"
              style={{ gap: '8px' }}
            >
              <Camera size={18} />
              Open Camera Scanner
            </button>

            <button
              onClick={exportRosterCsv}
              className="btn-secondary"
              style={{ gap: '8px' }}
            >
              <Download size={16} />
              Export Roster CSV
            </button>

            <button
              onClick={handleTriggerCertificates}
              disabled={certLoading}
              className="btn-secondary"
              style={{ gap: '8px' }}
            >
              {certLoading ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
              {certLoading ? 'Dispatching...' : 'Dispatch Certificates'}
            </button>

            <button
              onClick={handleClearRoster}
              className="btn-secondary"
              style={{ gap: '6px', color: '#DC2626', borderColor: '#FCA5A5' }}
              title="Clear all registered participants"
            >
              Reset Roster
            </button>
          </div>
        </div>

        {/* Certificate Dispatch Status Alert */}
        {certStatus && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            background: certStatus.success ? 'var(--status-present-bg)' : '#FEF2F2',
            border: `1px solid ${certStatus.success ? 'rgba(5, 150, 105, 0.3)' : '#FCA5A5'}`,
            color: certStatus.success ? 'var(--status-present)' : '#991B1B',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={18} />
            <span>{certStatus.message}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div className="surface-card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Total Registrations</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {participants.length}
            </div>
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Verified Present</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--status-present)', fontFamily: 'var(--font-mono)' }}>
              {presentCount}
            </div>
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Pending Check-in</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--status-pending)', fontFamily: 'var(--font-mono)' }}>
              {participants.length - presentCount}
            </div>
          </div>
        </div>

        {/* Manual Check-in Form */}
        <div className="surface-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Manual Participant ID Check-In
          </h3>

          {manualMessage && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '12px',
              background: manualMessage.success ? 'var(--status-present-bg)' : '#FEF2F2',
              color: manualMessage.success ? 'var(--status-present)' : '#991B1B',
              fontSize: '0.8125rem',
            }}>
              {manualMessage.text}
            </div>
          )}

          <form onSubmit={handleManualCheckIn} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. EVT-000002"
              className="input-field"
              style={{ maxWidth: '300px' }}
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
            <button
              type="submit"
              disabled={manualLoading || !manualId.trim()}
              className="btn-primary"
            >
              {manualLoading ? 'Checking In...' : 'Verify & Check In'}
            </button>
          </form>
        </div>

        {/* Live Attendance Table */}
        <div className="surface-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                Live Attendee Roster
              </h3>
              
              {/* Roster Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-subtle)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
                {['All', 'Present', 'Pending'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    style={{
                      background: statusFilter === f ? '#FFFFFF' : 'none',
                      border: 'none',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: statusFilter === f ? 700 : 500,
                      color: statusFilter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      boxShadow: statusFilter === f ? 'var(--shadow-subtle)' : 'none',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search by ID, name, team..."
                className="input-field"
                style={{ paddingLeft: '32px', paddingBlock: '6px', fontSize: '0.8125rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Participant ID</th>
                  <th>Attendee Name</th>
                  <th>Assigned Team</th>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Check-In Time</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No participants matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {p.participantId}
                      </td>
                      <td>
                        <strong>{p.fullName}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.email}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {p.teamId || 'TEAM-1002'}
                      </td>
                      <td>{p.eventName}</td>
                      <td>
                        <StatusBadge status={p.attendance || 'Pending'} />
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {p.checkInTime ? new Date(p.checkInTime).toLocaleTimeString('en-IN') : '–'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(p.attendance || '').toLowerCase() === 'present' || p.certificateSent === 'yes' ? (
                            <button
                              type="button"
                              onClick={() => setActiveCertificateParticipant(p)}
                              className="btn-accent btn-sm"
                              style={{ padding: '2px 8px', fontSize: '0.75rem', gap: '4px' }}
                              title="View and Download Certificate"
                            >
                              <Award size={12} />
                              {p.certificateSent === 'yes' ? 'Dispatched (View)' : 'Ready (View)'}
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              Pending check-in
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={() => {
          fetchRoster();
        }}
      />

      {/* Official Certificate Preview & Download Modal */}
      <CertificateModal
        participant={activeCertificateParticipant}
        isOpen={Boolean(activeCertificateParticipant)}
        onClose={() => setActiveCertificateParticipant(null)}
      />
    </div>
  );
}

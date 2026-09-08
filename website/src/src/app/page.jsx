'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Zap, QrCode, Award, BarChart3, Clock, X, Info } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import RegistrationModal from '@/components/RegistrationModal';

const INITIAL_EVENTS = [
  {
    id: 'EVT-H-001',
    name: 'AI Innovation Hackathon',
    category: 'Hackathon',
    date: '2026-09-15',
    endDate: '2026-09-17',
    location: 'Main Innovation Hall & Virtual',
    status: 'Ongoing',
    registrationOpen: true,
    maxParticipants: 120,
    currentCount: 42,
    description: 'A 48-hour intensive buildathon focused on practical generative AI pipelines, multi-agent systems, and production automation workflows.',
    schedule: [
      { time: '09:00 AM', label: 'Opening Keynote & Problem Statements' },
      { time: '11:00 AM', label: 'Hacking Commences & Team Registration' },
      { time: '03:00 PM', label: 'Mentor Review & Architecture Evaluation' },
      { time: '05:00 PM', label: 'Demo Round & Award Ceremony' }
    ]
  },
  {
    id: 'EVT-W-001',
    name: 'Modern Web Architecture Workshop',
    category: 'Workshop',
    date: '2026-09-25',
    endDate: '2026-09-25',
    location: 'Auditorium B (Live Interactive)',
    status: 'Upcoming',
    registrationOpen: true,
    maxParticipants: 80,
    currentCount: 38,
    description: 'Deep dive into scalable frontend systems, Next.js server actions, webhook orchestration, and headless API integrations.',
    schedule: [
      { time: '10:00 AM', label: 'Fullstack App Architecture Essentials' },
      { time: '01:00 PM', label: 'Hands-on Webhook & API Bridge Labs' },
      { time: '04:00 PM', label: 'Production Deployment & Q&A' }
    ]
  },
  {
    id: 'EVT-B-001',
    name: 'Machine Learning Engineering Bootcamp',
    category: 'Bootcamp',
    date: '2026-10-05',
    endDate: '2026-10-08',
    location: 'Computing Lab 4 & Hybrid Stream',
    status: 'Upcoming',
    registrationOpen: true,
    maxParticipants: 60,
    currentCount: 29,
    description: 'Comprehensive 4-day cohort covering data engineering pipelines, vector embeddings, fine-tuning LLMs, and real-time inference serving.',
    schedule: [
      { time: 'Day 1', label: 'Data Preprocessing & Feature Engineering' },
      { time: 'Day 2', label: 'Model Training & Evaluation Metrics' },
      { time: 'Day 3', label: 'RAG & Vector Database Architecture' },
      { time: 'Day 4', label: 'Model Deployment & API Serving' }
    ]
  }
];

export default function HomePage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data.events && data.events.length > 0) {
            setEvents(data.events);
          }
        }
      } catch (err) {
        console.error('Failed to refresh events from API', err);
      }
    }
    fetchEvents();
  }, []);

  const openRegister = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Standard category definitions with keys and labels
  const CATEGORY_TABS = [
    { key: 'ALL', label: 'All Formats' },
    { key: 'HACKATHON', label: 'Hackathons' },
    { key: 'WORKSHOP', label: 'Workshops' },
    { key: 'BOOTCAMP', label: 'Bootcamps' },
  ];

  // Helper function to match categories flexibly (case-insensitive, singular/plural safe)
  const isCategoryMatch = (eventCategory, tabKey) => {
    if (tabKey === 'ALL') return true;
    if (!eventCategory) return false;
    const cat = eventCategory.toString().trim().toUpperCase().replace(/S$/, '');
    const tab = tabKey.trim().toUpperCase().replace(/S$/, '');
    return cat === tab || cat.includes(tab) || tab.includes(cat);
  };

  const filteredEvents = events.filter((e) => isCategoryMatch(e.category, activeCategory));

  const getCategoryCount = (tabKey) => {
    if (tabKey === 'ALL') return events.length;
    return events.filter((e) => isCategoryMatch(e.category, tabKey)).length;
  };

  return (
    <div>
      {/* Editorial Hero */}
      <section style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: '#FFFFFF',
        padding: '72px 0 60px',
      }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '24px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-present)' }} />
              n8n Cloud Automation Active
            </div>

            <h1 style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}>
              Automated event operations, check-ins, and participant intelligence.
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '680px',
            }}>
              EventPilot AI synchronizes registration workflows, dynamic QR passes, live attendance validation, automated certificate dispatch, and Groq LLM feedback intelligence in real time.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a href="#events-matrix" className="btn-primary">
                Browse Active Events
              </a>
              <Link href="/portal" className="btn-secondary">
                Student Access Portal
              </Link>
              <Link href="/staff" className="btn-secondary">
                Staff QR Scanner
              </Link>
              <Link href="/admin" className="btn-secondary">
                Admin Command
              </Link>
            </div>
          </div>

          {/* Operational Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Pipeline Latency
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }} className="tabular-nums">
                &lt; 350ms
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Database Architecture
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Google Sheets API
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Workflow Orchestrator
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                n8n Cloud Enterprise
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                AI Analysis Engine
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Groq Llama 3.1 LLM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Events Matrix Section */}
      <section id="events-matrix" style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Scheduled Events Catalog
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                Register to receive an instant sequential Participant ID, auto-generated Team ID, and Drive QR pass.
              </p>
            </div>
          </div>

          {/* Category Filter Tabs with Count Badges */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            marginBottom: '28px',
          }}>
            {CATEGORY_TABS.map((tab) => {
              const count = getCategoryCount(tab.key);
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  style={{
                    background: isActive ? 'var(--text-primary)' : 'var(--bg-surface)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    border: `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-surface-subtle)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid of Events or Empty State */}
          {filteredEvents.length === 0 ? (
            <div className="surface-card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <Info size={32} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                No events found under this category
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
                There are currently no scheduled events matching this filter.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className="btn-primary"
                style={{ display: 'inline-flex' }}
              >
                Show All Formats ({events.length})
              </button>
            </div>
          ) : (
            <div className="grid-3">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="surface-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-surface-subtle)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {evt.id}
                    </span>
                    <StatusBadge status={evt.status} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {evt.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {evt.description}
                  </p>
                </div>

                <div>
                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      <span>{evt.date} {evt.endDate !== evt.date && `– ${evt.endDate}`}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="var(--text-muted)" />
                      <span>{evt.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} color="var(--text-muted)" />
                      <span>{evt.currentCount} / {evt.maxParticipants} Registered</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewEvent(evt)}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      View Agenda
                    </button>
                    <button
                      type="button"
                      onClick={() => openRegister(evt)}
                      className="btn-primary"
                      style={{ flex: 1 }}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* 4-Stage Operational Architecture Section */}
      <section style={{
        background: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '64px 0',
      }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Four-Stage Automation Pipeline
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Built on verified, high-availability n8n webhooks with native Google Workspace & Groq AI orchestration.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            <div style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '16px' }}>
              <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                STAGE 01
              </span>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '6px 0' }}>
                Sequential Pass Generation
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Generates <code style={{ fontFamily: 'var(--font-mono)' }}>EVT-XXXXXX</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>TEAM-XXXX</code>, records into Google Sheets, builds QR pass, and emails student.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--status-present)', paddingLeft: '16px' }}>
              <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--status-present)' }}>
                STAGE 02
              </span>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '6px 0' }}>
                Camera QR Attendance
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Staff scanner decodes badge in real time, validates pending status, updates attendance to Present, and timestamps check-in.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid #8B5CF6', paddingLeft: '16px' }}>
              <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#8B5CF6' }}>
                STAGE 03
              </span>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '6px 0' }}>
                Dynamic Slide Certificates
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Clones master Google Slides presentation, injects name/event, converts to crisp PDF, and dispatches via Gmail.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--status-pending)', paddingLeft: '16px' }}>
              <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--status-pending)' }}>
                STAGE 04
              </span>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '6px 0' }}>
                Groq AI Intelligence
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Aggregates survey responses and uses Groq Llama 3.1 LLM to compile an executive HTML sentiment report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda / Schedule Drawer Modal */}
      {previewEvent && (
        <div className="modal-overlay" onClick={() => setPreviewEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {previewEvent.category} Overview
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
                  {previewEvent.name}
                </h3>
              </div>
              <button onClick={() => setPreviewEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              {previewEvent.description}
            </p>

            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--accent-primary)" /> Event Schedule & Milestones
            </h4>

            <div style={{ marginBottom: '24px', paddingLeft: '8px' }}>
              {(previewEvent.schedule || []).map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>
                    {item.time}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  const target = previewEvent;
                  setPreviewEvent(null);
                  openRegister(target);
                }}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Proceed to Registration
              </button>
              <button type="button" onClick={() => setPreviewEvent(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      <RegistrationModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

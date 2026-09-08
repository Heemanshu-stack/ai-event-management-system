// In-memory runtime store synchronized with Google Sheets / Demo data

let eventsStore = [
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

let usersStore = [];

let registrationsStore = [];

export function getEvents() {
  return eventsStore;
}

export function getEventById(id) {
  return eventsStore.find(e => e.id === id);
}

export function addEvent(newEvent) {
  eventsStore.push(newEvent);
  return newEvent;
}

export function getUsers() {
  return usersStore;
}

export function getUserByEmail(email) {
  if (!email) return null;
  return usersStore.find(u => u.email?.toLowerCase() === email.toLowerCase());
}

export function getUserByUsernameOrEmail(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  return usersStore.find(u => u.email?.toLowerCase() === clean || u.username?.toLowerCase() === clean);
}

export function addUser(user) {
  usersStore.push(user);
  return user;
}

export function getRegistrations() {
  return registrationsStore;
}

export function getRegistrationsByEmail(email) {
  return registrationsStore.filter(r => r.email.toLowerCase() === email.toLowerCase());
}

export function getParticipantById(participantId) {
  return registrationsStore.find(r => r.participantId === participantId);
}

export function addRegistration(reg) {
  const existing = registrationsStore.find(r => r.email === reg.email && r.eventId === reg.eventId);
  if (existing) {
    Object.assign(existing, reg);
    return existing;
  }
  registrationsStore.push(reg);
  return reg;
}

export function updateParticipantAttendance(participantId, status = 'Present') {
  const participant = registrationsStore.find(r => r.participantId === participantId);
  if (participant) {
    participant.attendance = status;
    participant.checkInTime = new Date().toISOString();
    return participant;
  }
  return null;
}

export function updateParticipantCertificate(participantId, status = 'yes') {
  const participant = registrationsStore.find(r => r.participantId === participantId);
  if (participant) {
    participant.certificateSent = status;
    return participant;
  }
  return null;
}

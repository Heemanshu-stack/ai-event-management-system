// Browser-level persistent storage utility for EventPilot AI
// Ensures registrations and check-ins persist across Vercel serverless cold starts and browser reloads

const STORAGE_KEY = 'eventpilot_registrations_v1';

export function getLocalRegistrations() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read local registrations:', e);
    return [];
  }
}

export function saveLocalRegistration(newReg) {
  if (typeof window === 'undefined' || !newReg) return;
  try {
    const existing = getLocalRegistrations();
    // Check if participantId or email+eventId already exists
    const idx = existing.findIndex(
      (r) =>
        (r.participantId && r.participantId === newReg.participantId) ||
        (r.email?.toLowerCase() === newReg.email?.toLowerCase() && r.eventId === newReg.eventId)
    );

    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...newReg };
    } else {
      existing.unshift(newReg);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save local registration:', e);
  }
}

export function updateLocalAttendance(participantId, status = 'Present') {
  if (typeof window === 'undefined' || !participantId) return null;
  try {
    const cleanId = String(participantId).trim().toUpperCase();
    const existing = getLocalRegistrations();
    const item = existing.find(
      (r) => r.participantId?.toUpperCase() === cleanId
    );

    if (item) {
      item.attendance = status;
      item.checkInTime = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return item;
    } else {
      // If not in local storage, create a stub so staff scanner tracks it
      const stub = {
        participantId: cleanId,
        teamId: `TEAM-${cleanId.replace(/\D/g, '') || '1000'}`,
        fullName: `Participant (${cleanId})`,
        email: '',
        phone: '',
        college: '',
        eventName: 'Registered Event',
        registrationTime: new Date().toISOString(),
        attendance: status,
        checkInTime: new Date().toISOString(),
        certificateSent: 'No',
      };
      existing.unshift(stub);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return stub;
    }
  } catch (e) {
    console.error('Failed to update local attendance:', e);
    return null;
  }
}

export function mergeRegistrations(serverRegs = []) {
  const localRegs = getLocalRegistrations();
  const map = new Map();

  // Add server items first
  for (const r of serverRegs) {
    if (r.participantId) {
      map.set(r.participantId.toUpperCase(), r);
    } else if (r.email && r.eventId) {
      map.set(`${r.email.toLowerCase()}_${r.eventId}`, r);
    }
  }

  // Merge or prepend local items
  for (const r of localRegs) {
    const key = r.participantId ? r.participantId.toUpperCase() : `${r.email?.toLowerCase()}_${r.eventId}`;
    if (map.has(key)) {
      const serverItem = map.get(key);
      // Server 'Present' status takes precedence across devices
      const finalAttendance = serverItem.attendance === 'Present' ? 'Present' : (r.attendance === 'Present' ? 'Present' : (serverItem.attendance || r.attendance || 'Pending'));
      map.set(key, {
        ...serverItem,
        ...r,
        attendance: finalAttendance,
        checkInTime: serverItem.checkInTime || r.checkInTime,
      });
    } else {
      map.set(key, r);
    }
  }

  return Array.from(map.values());
}

export function clearLocalRegistrations() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('eventpilot_registrations');
  } catch (e) {
    console.error('Failed to clear local registrations:', e);
  }
}


// Live Google Sheets synchronization service for EventPilot AI
// Fetches real-time participant and attendance data from the connected Google Sheet

const SHEET_ID = '13RfCRYW6INDplK1nRrJMrT_EqqF2apCGgdMXuQDEDYI';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Participants`;

function parseFullCSV(text) {
  const rows = [];
  let row = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(current.trim().replace(/^"|"$/g, '').trim());
      current = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(current.trim().replace(/^"|"$/g, '').trim());
      if (row.some((x) => x.length > 0)) rows.push(row);
      row = [];
      current = '';
    } else {
      current += c;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim().replace(/^"|"$/g, '').trim());
    if (row.some((x) => x.length > 0)) rows.push(row);
  }

  return rows;
}

export async function fetchLiveSheetRegistrations(resetCutoffTimestamp = null) {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 0 },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
      return null;
    }

    const rows = parseFullCSV(text);
    if (rows.length <= 1) return [];

    const headers = rows[0].map((h) => h.toLowerCase().trim());

    const pIdIdx = headers.findIndex((h) => h.includes('participantid') || h.includes('participant id'));
    const nameIdx = headers.findIndex((h) => h === 'name' || h === 'fullname');
    const emailIdx = headers.findIndex((h) => h === 'email');
    const phoneIdx = headers.findIndex((h) => h === 'phone');
    const collegeIdx = headers.findIndex((h) => h === 'college');
    const eventIdx = headers.findIndex((h) => h === 'event');
    const timeIdx = headers.findIndex((h) => h.includes('registration time') || h.includes('timestamp'));
    const qrIdx = headers.findIndex((h) => h.includes('qr code link') || h.includes('qr'));
    const attIdx = headers.findIndex((h) => h === 'attendance');
    const certIdx = headers.findIndex((h) => h.includes('certificate sent') || h.includes('certificate'));
    const checkInIdx = headers.findIndex((h) => h.includes('check-in time') || h.includes('check in'));
    const teamIdx = headers.findIndex((h) => h.includes('teamid') || h.includes('team id'));
    const certUrlIdx = headers.findIndex((h) => h.includes('certificateurl') || h.includes('certificate url'));

    const registrations = [];

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      let participantId = pIdIdx >= 0 && cols[pIdIdx] ? cols[pIdIdx].trim() : '';

      // Match EVT-XXXXXX in case of trailing whitespace/newlines
      const match = participantId.match(/(EVT-\d+)/i);
      if (match) {
        participantId = match[1].toUpperCase();
      }

      if (!participantId) continue;

      const regTimeRaw = timeIdx >= 0 && cols[timeIdx] ? cols[timeIdx].trim() : '';
      if (resetCutoffTimestamp) {
        if (!regTimeRaw) continue;
        const regTimeMs = new Date(regTimeRaw).getTime();
        if (isNaN(regTimeMs) || regTimeMs <= resetCutoffTimestamp) {
          continue;
        }
      }

      const rawAtt = attIdx >= 0 && cols[attIdx] ? cols[attIdx].trim() : 'Pending';
      const attendance = /present/i.test(rawAtt) ? 'Present' : 'Pending';

      registrations.push({
        participantId,
        fullName: nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx].trim() : 'Participant',
        email: emailIdx >= 0 && cols[emailIdx] ? cols[emailIdx].trim() : '',
        phone: phoneIdx >= 0 && cols[phoneIdx] ? cols[phoneIdx].trim() : '',
        college: collegeIdx >= 0 && cols[collegeIdx] ? cols[collegeIdx].trim() : '',
        eventName: eventIdx >= 0 && cols[eventIdx] ? cols[eventIdx].trim() : 'AI Innovation Hackathon',
        registrationTime: regTimeRaw,
        qrCodeLink: qrIdx >= 0 && cols[qrIdx] ? cols[qrIdx].trim() : '',
        attendance,
        certificateSent: certIdx >= 0 && cols[certIdx] && /yes/i.test(cols[certIdx]) ? 'yes' : 'No',
        certificateUrl: certUrlIdx >= 0 && cols[certUrlIdx] ? cols[certUrlIdx].trim() : '',
        checkInTime: checkInIdx >= 0 && cols[checkInIdx] ? cols[checkInIdx].trim() : null,
        teamId: teamIdx >= 0 && cols[teamIdx] ? cols[teamIdx].trim() : `TEAM-${participantId.replace(/\D/g, '') || '1001'}`,
      });
    }

    return registrations;
  } catch (err) {
    console.error('Error fetching live Google Sheet registrations:', err);
    return null;
  }
}

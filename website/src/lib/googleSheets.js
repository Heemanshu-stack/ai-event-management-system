// Live Google Sheets synchronization service for EventPilot AI
const SHEET_ID = '13RfCRYW6INDplK1nRrJMrT_EqqF2apCGgdMXuQDEDYI';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Participants`;

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchLiveSheetRegistrations() {
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

    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) return [];

    const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').trim());

    const pIdIdx = headers.findIndex((h) => /participantid|participant id/i.test(h));
    const nameIdx = headers.findIndex((h) => /^name$|^fullname$/i.test(h));
    const emailIdx = headers.findIndex((h) => /^email$/i.test(h));
    const phoneIdx = headers.findIndex((h) => /^phone$/i.test(h));
    const collegeIdx = headers.findIndex((h) => /^college$/i.test(h));
    const eventIdx = headers.findIndex((h) => /^event$/i.test(h));
    const timeIdx = headers.findIndex((h) => /registration time|timestamp/i.test(h));
    const qrIdx = headers.findIndex((h) => /qr code link|qr/i.test(h));
    const attIdx = headers.findIndex((h) => /^attendance$/i.test(h));
    const certIdx = headers.findIndex((h) => /certificate sent|certificate/i.test(h));
    const checkInIdx = headers.findIndex((h) => /check-in time|check in/i.test(h));
    const teamIdx = headers.findIndex((h) => /teamid|team id/i.test(h));

    const registrations = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]).map((c) => c.replace(/^"|"$/g, '').trim());
      const participantId = pIdIdx >= 0 ? cols[pIdIdx] : '';

      if (!participantId) continue;

      registrations.push({
        participantId,
        fullName: nameIdx >= 0 ? cols[nameIdx] : 'Participant',
        email: emailIdx >= 0 ? cols[emailIdx] : '',
        phone: phoneIdx >= 0 ? cols[phoneIdx] : '',
        college: collegeIdx >= 0 ? cols[collegeIdx] : '',
        eventName: eventIdx >= 0 ? cols[eventIdx] : 'Registered Event',
        registrationTime: timeIdx >= 0 ? cols[timeIdx] : '',
        qrCodeLink: qrIdx >= 0 ? cols[qrIdx] : '',
        attendance: attIdx >= 0 && cols[attIdx] ? cols[attIdx] : 'Pending',
        certificateSent: certIdx >= 0 && cols[certIdx] ? cols[certIdx] : 'No',
        checkInTime: checkInIdx >= 0 ? cols[checkInIdx] : null,
        teamId: teamIdx >= 0 && cols[teamIdx] ? cols[teamIdx] : `TEAM-${participantId.replace(/\D/g, '') || '1001'}`,
      });
    }

    return registrations;
  } catch (err) {
    console.error('Error fetching live Google Sheet registrations:', err);
    return null;
  }
}

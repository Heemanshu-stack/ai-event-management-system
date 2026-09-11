import { NextResponse } from 'next/server';
import { getEvents, addEvent, getRegistrations, getResetTimestamp } from '@/lib/db';
import { fetchLiveSheetRegistrations } from '@/lib/googleSheets';

export async function GET() {
  const events = getEvents();
  const resetCutoff = getResetTimestamp();
  const liveSheetRegs = await fetchLiveSheetRegistrations(resetCutoff);
  const fallbackRegs = getRegistrations();
  const registrations = liveSheetRegs !== null ? liveSheetRegs : fallbackRegs;
  return NextResponse.json({ events, registrations, resetTimestamp: resetCutoff });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, category, date, endDate, location, maxParticipants, description } = body;

    if (!name || !date) {
      return NextResponse.json({ error: 'Name and date are required' }, { status: 400 });
    }

    const newEvt = {
      id: body.id || `EVT-${Date.now().toString().slice(-4)}`,
      name,
      category: category || 'Workshop',
      date,
      endDate: endDate || date,
      location: location || 'Main Hall',
      status: 'Upcoming',
      registrationOpen: true,
      maxParticipants: parseInt(maxParticipants, 10) || 50,
      currentCount: 0,
      description: description || 'Technical hands-on event.',
    };

    addEvent(newEvt);
    return NextResponse.json({ success: true, event: newEvt });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

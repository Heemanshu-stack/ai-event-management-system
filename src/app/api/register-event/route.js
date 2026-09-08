import { NextResponse } from 'next/server';
import { triggerN8NWebhook } from '@/lib/n8n';
import { addRegistration, getRegistrations } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, college, event, eventId } = body;

    if (!fullName || !email || !event) {
      return NextResponse.json({ error: 'Full name, email, and event name are required' }, { status: 400 });
    }

    const payload = {
      fullName,
      email,
      phone: phone || '',
      college: college || '',
      event,
      eventId: eventId || 'EVT-H-001',
      timestamp: new Date().toISOString(),
    };

    // Trigger n8n Cloud registration webhook
    const n8nResult = await triggerN8NWebhook('event-registration', payload);

    // Calculate fallback sequential IDs if n8n is offline
    const totalCount = getRegistrations().length + 1;
    const participantId = n8nResult.data?.participantId || `EVT-${String(totalCount).padStart(6, '0')}`;
    const teamId = n8nResult.data?.teamId || `TEAM-${String(1000 + totalCount)}`;
    const qrCodeUrl = n8nResult.data?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(participantId)}`;

    const newReg = {
      participantId,
      teamId,
      eventId: payload.eventId,
      eventName: event,
      fullName,
      email,
      phone: payload.phone,
      college: payload.college,
      registrationTime: payload.timestamp,
      attendance: 'Pending',
      checkInTime: null,
      certificateSent: 'No',
      qrCodeLink: qrCodeUrl,
    };

    addRegistration(newReg);

    return NextResponse.json({
      success: true,
      participantId,
      teamId,
      qrCodeUrl,
      message: 'Registration completed successfully! Confirmation email dispatched.',
    });
  } catch (error) {
    console.error('Registration event API error:', error);
    return NextResponse.json({ error: 'Internal server error during event registration' }, { status: 500 });
  }
}

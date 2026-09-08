import { NextResponse } from 'next/server';
import { triggerN8NWebhook } from '@/lib/n8n';
import { updateParticipantAttendance, getParticipantById } from '@/lib/db';

export async function POST(req) {
  try {
    const { participantId, name, event } = await req.json();

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required for check-in' }, { status: 400 });
    }

    const payload = {
      participantId,
      name: name || '',
      event: event || '',
    };

    // Trigger n8n Cloud attendance checkin webhook
    await triggerN8NWebhook('attendance-checkin', payload);

    // Update runtime DB
    const updated = updateParticipantAttendance(participantId, 'Present');
    const participant = updated || getParticipantById(participantId);

    return NextResponse.json({
      success: true,
      participantId,
      name: participant?.fullName || name || participantId,
      status: 'Present',
      message: `Verified and checked in: ${participant?.fullName || participantId}`,
    });
  } catch (error) {
    console.error('Checkin API error:', error);
    return NextResponse.json({ error: 'Check-in processing error' }, { status: 500 });
  }
}

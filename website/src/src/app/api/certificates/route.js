import { NextResponse } from 'next/server';
import { triggerN8NWebhook } from '@/lib/n8n';
import { getRegistrations, updateParticipantCertificate } from '@/lib/db';

export async function POST() {
  try {
    // Trigger n8n Cloud certificate generation & dispatch webhook
    const n8nResult = await triggerN8NWebhook('send-certificates', {
      timestamp: new Date().toISOString(),
      action: 'dispatch_batch',
    });

    // Update all present attendees
    const registrations = getRegistrations();
    let count = 0;
    registrations.forEach((reg) => {
      if ((reg.attendance || '').toLowerCase() === 'present') {
        updateParticipantCertificate(reg.participantId, 'yes');
        count++;
      }
    });

    return NextResponse.json({
      success: true,
      count,
      message: `Batch certificate pipeline initiated via n8n for ${count} verified attendee(s).`,
      details: n8nResult.data,
    });
  } catch (error) {
    console.error('Certificate batch API error:', error);
    return NextResponse.json({ error: 'Failed to trigger certificate pipeline' }, { status: 500 });
  }
}

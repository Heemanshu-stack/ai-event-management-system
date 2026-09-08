import { NextResponse } from 'next/server';
import { triggerN8NWebhook } from '@/lib/n8n';

export async function POST(req) {
  try {
    const body = await req.json();

    // Trigger n8n Cloud AI Feedback Analysis webhook
    const n8nResult = await triggerN8NWebhook('event-feedback', body);

    return NextResponse.json({
      success: true,
      message: 'Groq LLM Sentiment & Insights Report generated and emailed to organizer.',
      reportHtml: n8nResult.data?.reportHtml || '',
      data: n8nResult.data,
    });
  } catch (error) {
    console.error('Feedback AI API error:', error);
    return NextResponse.json({ error: 'Failed to process AI feedback analysis' }, { status: 500 });
  }
}

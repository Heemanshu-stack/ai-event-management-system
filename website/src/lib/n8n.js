const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://rock05.app.n8n.cloud/webhook';

export async function triggerN8NWebhook(endpoint, payload) {
  const url = `${N8N_BASE_URL}/${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  } catch (error) {
    console.error(`Error calling n8n webhook (${endpoint}):`, error);
    return {
      ok: false,
      status: 500,
      error: error.message || 'Webhook invocation failed',
    };
  }
}

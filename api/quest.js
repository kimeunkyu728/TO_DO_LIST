// Vercel serverless function.
// Uses Groq's free-tier API (OpenAI-compatible) instead of a paid Anthropic key.
// 1. Get a free key at https://console.groq.com/keys
// 2. Set GROQ_API_KEY in your Vercel project's Environment Variables.
//
// The response is reshaped into the same {content:[{type:'text',text}]} /
// {error:{message}} format the client already expects, so index.html
// doesn't need to know which provider is behind this endpoint.

export default async function handler(req, res) {
  // Allow calls from other origins (e.g. a Netlify-hosted copy of the frontend).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: 'GROQ_API_KEY 환경변수가 설정되지 않았어요. https://console.groq.com/keys 에서 무료로 발급받아 등록하세요.' } });
    return;
  }

  try {
    const { system, user } = req.body || {};
    if (!system || !user) {
      res.status(400).json({ error: { message: 'system/user 파라미터가 필요해요.' } });
      return;
    }

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });

    const raw = await r.json();

    if (!r.ok) {
      res.status(502).json({ error: { message: (raw.error && raw.error.message) || 'Groq API 오류' } });
      return;
    }

    const text = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content;
    if (!text) {
      res.status(502).json({ error: { message: 'Groq 응답이 비어있어요.' } });
      return;
    }

    // Reshape to the Anthropic-style content array the client expects.
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    res.status(500).json({ error: { message: String((e && e.message) || e) } });
  }
}

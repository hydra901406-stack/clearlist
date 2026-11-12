import { createClient } from '@/lib/supabase/server';
import { admin } from '@/lib/supabase/admin';
const LIMITS = { pro: Number(process.env.AI_DAILY_LIMIT_PRO) || 20, premium: Number(process.env.AI_DAILY_LIMIT_PREMIUM) || 500 };
export async function POST(req) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const db = admin();
  const { data: sub } = await db.from('subscriptions').select('status,plan').eq('user_id', user.id).maybeSingle();
  if (!sub || !['trialing', 'active'].includes(sub.status)) return Response.json({ error: 'An active plan is required' }, { status: 402 });
  const plan = sub.plan === 'premium' ? 'premium' : 'pro';
  const day = new Date().toISOString().slice(0, 10);
  const { data: u } = await db.from('ai_usage').select('count').eq('user_id', user.id).eq('day', day).maybeSingle();
  const used = u?.count || 0;
  if (used >= LIMITS[plan]) {
    return Response.json({ error: plan === 'pro' ? 'Daily AI limit reached. Upgrade to Premium for unlimited use' : 'Fair-use AI limit reached for today' }, { status: 429 });
  }
  let body; try { body = await req.json(); } catch { return Response.json({ error: 'Bad request' }, { status: 400 }); }
  const messages = (body.messages || []).slice(-12).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 8000) }));
  if (!messages.length || messages[0].role !== 'user') return Response.json({ error: 'Bad request' }, { status: 400 });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 1500, system: String(body.system || '').slice(0, 10000), messages }),
  });
  if (!r.ok) return Response.json({ error: 'AI request failed' }, { status: 502 });
  const j = await r.json();
  const text = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  await db.from('ai_usage').upsert({ user_id: user.id, day, count: used + 1 });
  return Response.json({ text });
}

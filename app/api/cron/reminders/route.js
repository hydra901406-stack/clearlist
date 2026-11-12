import { admin } from '@/lib/supabase/admin';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Runs once a day (see vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>".
export async function GET(req) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });
  const db = admin();
  const { data: rows } = await db.from('workspaces').select('email,data');
  const day = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  const today = day(0), soon = day(2);
  let sent = 0;
  for (const w of rows || []) {
    const d = w.data || {};
    if (!w.email || d.remindersOff) continue;
    const tasks = (d.tasks || []).filter((t) => t.status !== 'done' && t.dueIso && t.dueIso <= soon);
    const inv = (d.invoices || []).filter((i) => i.status !== 'paid' && i.dueIso && i.dueIso < today);
    if (!tasks.length && !inv.length) continue;
    const html = `<div style="font-family:system-ui,sans-serif;color:#0c2d48"><h2>Your Clearlist reminders</h2>${tasks.length ? `<h3>Tasks due soon</h3><ul>${tasks.map((t) => `<li>${esc(t.title)} (${esc(t.dueIso)})</li>`).join('')}</ul>` : ''}${inv.length ? `<h3>Overdue invoices</h3><ul>${inv.map((i) => `<li>${esc(i.no)}: $${esc(i.amount)} (due ${esc(i.dueIso)})</li>`).join('')}</ul>` : ''}<p style="color:#6b8299;font-size:12px">Turn these emails off in Clearlist under Settings.</p></div>`;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.REMINDER_FROM || 'Clearlist <onboarding@resend.dev>', to: [w.email], subject: 'Your Clearlist reminders', html }),
    });
    if (r.ok) sent++;
  }
  return Response.json({ sent });
}

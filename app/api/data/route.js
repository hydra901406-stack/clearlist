import { createClient } from '@/lib/supabase/server';
// Loads and saves one person's workspace. Row level security in Supabase means a user can only touch their own row.
export async function GET() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const { data, error } = await sb.from('workspaces').select('data').eq('user_id', user.id).maybeSingle();
  if (error) return Response.json({ error: 'Load failed' }, { status: 500 });
  return Response.json({ data: data?.data ?? null });
}
export async function PUT(req) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
  const text = await req.text();
  if (text.length > 3_000_000) return Response.json({ error: 'Workspace too large' }, { status: 413 });
  let data; try { data = JSON.parse(text); } catch { return Response.json({ error: 'Bad data' }, { status: 400 }); }
  const { error } = await sb.from('workspaces').upsert({ user_id: user.id, email: user.email, data, updated_at: new Date().toISOString() });
  if (error) return Response.json({ error: 'Save failed' }, { status: 500 });
  return Response.json({ ok: true });
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Refresh from '@/components/Refresh';
export const dynamic = 'force-dynamic';
export default async function AppPage({ searchParams }) {
  const sp = await searchParams;
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/');
  const { data: sub } = await sb.from('subscriptions').select('status,trial_end,plan').eq('user_id', user.id).maybeSingle();
  const ok = sub && ['trialing', 'active'].includes(sub.status);
  if (!ok) {
    if (sp?.welcome) return (<main className="center"><p>Finishing setup…</p><Refresh /></main>);
    redirect('/subscribe');
  }
  const name = user.user_metadata?.full_name || user.email.split('@')[0];
  return (<>
    <header className="bar">
      <img className="logo" src="/logo.png" alt="Clearlist" /><span>Welcome, {name}</span><span className="grow" />
      <form action="/api/portal" method="post"><button type="submit">Manage billing</button></form>
      <form action="/auth/signout" method="post"><button type="submit">Sign out</button></form>
    </header>
    <iframe className="frame" title="Clearlist" src={`/clearlist.html?embed=1&name=${encodeURIComponent(name)}&status=${sub.status}&plan=${sub.plan || ''}&email=${encodeURIComponent(user.email)}&te=${sub.trial_end ? Math.floor(new Date(sub.trial_end).getTime() / 1000) : 0}`} />
  </>);
}

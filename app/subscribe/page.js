import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
const plans = [
  { k: 'pro', name: 'Pro', price: 15, feats: ['Clients, projects, tasks, invoices, calendar', 'Money, analytics, widgets, inventory', 'AI assistant, Pitch Lab, Product Ideas', 'Up to 20 AI requests a day'] },
  { k: 'premium', name: 'Premium', price: 20, feats: ['Everything in Pro', 'Unlimited AI use (fair use applies)', 'Made for heavy daily AI use'] },
];
export default async function Subscribe() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/');
  const { data: sub } = await sb.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle();
  if (sub && ['trialing', 'active'].includes(sub.status)) redirect('/app');
  return (
    <main className="center"><div style={{ width: '100%', maxWidth: 780 }}>
      <img className="logo" src="/logo.png" alt="Clearlist" />
      <h1>Start your free week</h1>
      <p>Both plans start with 7 days free, then renew monthly. Cancel before the trial ends and you won’t be charged.</p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        {plans.map((p) => (
          <div className="card" key={p.k} style={{ maxWidth: 'none' }}>
            <h2 style={{ margin: 0 }}>{p.name}</h2>
            <div style={{ fontSize: 34, fontWeight: 700, margin: '8px 0' }}>${p.price}<span style={{ fontSize: 14, color: '#6b8299', fontWeight: 400 }}> /month</span></div>
            <ul style={{ paddingLeft: 18, color: '#0c2d48', fontSize: 14, minHeight: 90 }}>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
            <form action="/api/checkout" method="post"><input type="hidden" name="plan" value={p.k} /><button type="submit">Start 7-day free trial</button></form>
          </div>
        ))}
      </div>
      <form action="/auth/signout" method="post" style={{ maxWidth: 200, marginTop: 16 }}><button type="submit">Sign out</button></form>
    </div></main>
  );
}

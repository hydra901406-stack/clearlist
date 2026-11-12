import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { admin } from '@/lib/supabase/admin';
import { stripe } from '@/lib/stripe';
export async function POST(req) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/', req.url), 303);
  const form = await req.formData().catch(() => null);
  const plan = form?.get('plan') === 'premium' ? 'premium' : 'pro';
  const price = plan === 'premium' ? process.env.STRIPE_PRICE_PREMIUM : process.env.STRIPE_PRICE_PRO;
  const db = admin();
  const { data: row } = await db.from('subscriptions').select('stripe_customer_id,status').eq('user_id', user.id).maybeSingle();
  // Already subscribed or trialing: plan changes happen in the billing portal, never a second checkout.
  if (row && ['trialing', 'active'].includes(row.status)) return NextResponse.redirect(new URL('/api/portal', req.url), 303);
  let cid = row?.stripe_customer_id;
  if (!cid) {
    const c = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
    cid = c.id;
    await db.from('subscriptions').upsert({ user_id: user.id, stripe_customer_id: cid, status: 'none' });
  }
  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: cid,
    client_reference_id: user.id,
    line_items: [{ price, quantity: 1 }],
    subscription_data: { trial_period_days: 7, metadata: { user_id: user.id, plan } },
    success_url: origin + '/app?welcome=1',
    cancel_url: origin + '/subscribe',
  });
  return NextResponse.redirect(session.url, 303);
}

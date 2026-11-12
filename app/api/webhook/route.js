import { stripe } from '@/lib/stripe';
import { admin } from '@/lib/supabase/admin';
const iso = (t) => (t ? new Date(t * 1000).toISOString() : null);
export async function POST(req) {
  const body = await req.text(); // the raw body is required to verify the signature
  let ev;
  try { ev = stripe.webhooks.constructEvent(body, req.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return new Response('Bad signature', { status: 400 }); }
  const db = admin();
  if (ev.type.startsWith('customer.subscription.')) {
    const sub = ev.data.object;
    let uid = sub.metadata?.user_id;
    if (!uid) {
      const { data } = await db.from('subscriptions').select('user_id').eq('stripe_customer_id', sub.customer).maybeSingle();
      uid = data?.user_id;
    }
    if (uid) {
      const item = sub.items?.data?.[0];
      const end = item?.current_period_end ?? sub.current_period_end;
      const plan = item?.price?.id === process.env.STRIPE_PRICE_PREMIUM ? 'premium' : 'pro';
      await db.from('subscriptions').upsert({
        user_id: uid, stripe_customer_id: sub.customer, stripe_subscription_id: sub.id,
        status: sub.status, plan, trial_end: iso(sub.trial_end), current_period_end: iso(end), updated_at: new Date().toISOString(),
      });
    }
  }
  return Response.json({ received: true });
}

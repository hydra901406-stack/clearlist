import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
export async function GET(req) { return POST(req); }
export async function POST(req) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/', req.url), 303);
  const { data: row } = await sb.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
  if (!row?.stripe_customer_id) return NextResponse.redirect(new URL('/subscribe', req.url), 303);
  const s = await stripe.billingPortal.sessions.create({ customer: row.stripe_customer_id, return_url: new URL('/app', req.url).toString() });
  return NextResponse.redirect(s.url, 303);
}

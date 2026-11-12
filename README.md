# Clearlist (Next.js, Supabase, Stripe)

Pro ($15/mo, up to 20 AI requests a day) and Premium ($20/mo, unlimited AI with a fair-use cap). Both start with a 7-day free trial that auto-charges after 7 days unless cancelled. Test mode first.

## Already done for you
- Supabase project "clearlist" created and the database schema applied (supabase/schema.sql).
- Stripe test-mode products and prices created: Pro, Premium, plus a customer portal that allows cancel and switching plans.
- `.env.example` already contains the public values and price IDs.

## What's left (you do these)
1. Google sign-in. console.cloud.google.com > new project > APIs & Services > OAuth consent screen (External; app name, your email, privacy URL and terms URL once you have a live address) > Credentials > Create credentials > OAuth client ID > Web application. Authorized redirect URI: https://dezmevoagrzsqixyqfpx.supabase.co/auth/v1/callback . Then Supabase > Authentication > Providers > Google: paste Client ID and secret and switch it on.
2. Emailed codes. Supabase > Authentication > Email Templates > "Magic Link": make the body include {{ .Token }} so the email shows a 6-digit code.
3. Put the code online. Create a GitHub repo, upload everything in this folder, then vercel.com > Add New > Project > import it.
4. Environment Variables in Vercel. Copy every line of `.env.example` (public values are filled in). Fill the secrets yourself in Vercel:
   - SUPABASE_SERVICE_ROLE_KEY: Supabase > Project Settings > API > service_role.
   - STRIPE_SECRET_KEY: Stripe (test mode) > Developers > API keys > Secret key.
   - ANTHROPIC_API_KEY: console.anthropic.com > API keys (this pays for the AI).
   - CRON_SECRET: any long random string. RESEND_API_KEY (optional, for reminder emails).
5. Deploy. Then Supabase > Authentication > URL Configuration: Site URL = your Vercel address, and add `https://YOUR-ADDRESS/**` to Redirect URLs.
6. Stripe webhook (the assistant can do this for you): endpoint https://YOUR-ADDRESS/api/webhook with events customer.subscription.created, customer.subscription.updated, customer.subscription.deleted. Its signing secret goes in Vercel as STRIPE_WEBHOOK_SECRET. Redeploy.
7. Test: sign up, pick a plan, pay with card 4242 4242 4242 4242 (any future date, any CVC).

## Before real customers
Fill in the [brackets] in app/privacy/page.js and app/terms/page.js and have a lawyer review them. Finish Stripe account verification, recreate the products in live mode, and swap in live keys and price IDs.

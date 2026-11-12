import Legal from '@/components/Legal';
export const metadata = { title: 'Privacy Policy | Clearlist' };
export default function Privacy() {
  return (
    <Legal title="Privacy Policy">
      <p>This policy explains what information Clearlist (“we”, “us”), operated by [Your legal name or business name], collects and how it is used. Questions: bibiworld12e@gmail.com.</p>
      <h3>What we collect</h3>
      <ul>
        <li><b>Account information:</b> your email address and, if you sign in with Google, your name and profile details Google shares with us. We never receive your Google password.</li>
        <li><b>Your workspace:</b> the clients, projects, tasks, invoices, notes, calendar events, expenses and settings you enter. Files you upload stay in your own browser.</li>
        <li><b>Billing information:</b> payments are handled by Stripe. Your card details go directly to Stripe and are never stored by us. We keep your subscription status and plan.</li>
        <li><b>Usage information:</b> a count of AI requests per day, used to apply plan limits.</li>
      </ul>
      <h3>How we use it</h3>
      <p>To run Clearlist, sign you in, save your work, bill you, apply plan limits, send the reminder emails you have turned on, answer support requests, and keep the service secure.</p>
      <h3>Who processes it for us</h3>
      <ul>
        <li>Supabase (sign-in and database), Vercel (hosting), Stripe (payments).</li>
        <li>Anthropic (AI features): when you use Ask Hub, Pitch Lab or Product Ideas, the text you submit, and for Ask Hub a summary of your workspace, is sent to Anthropic to generate a reply.</li>
        <li>Resend (email reminders), only if reminders are on.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h3>Cookies</h3>
      <p>We use cookies only to keep you signed in. We do not use advertising cookies.</p>
      <h3>Security</h3>
      <p>Clearlist uses HTTPS, and database access rules ensure each account can read only its own workspace. No system is perfectly secure, so please use a strong sign-in method.</p>
      <h3>Your choices</h3>
      <p>You can export or delete your workspace in Settings, cancel your subscription at any time, and email us to request deletion of your account and data.</p>
      <h3>Retention</h3>
      <p>We keep your data while your account is open. After you ask us to delete it, we remove it, except where we must keep billing records by law.</p>
      <h3>Children</h3>
      <p>Clearlist is not for anyone under 18.</p>
      <h3>Changes</h3>
      <p>If we change this policy we will update the date above and, for important changes, tell you in the app or by email.</p>
      <h3>Contact</h3>
      <p>bibiworld12e@gmail.com</p>
    </Legal>
  );
}

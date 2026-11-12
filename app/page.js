'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignIn() {
  const sb = createClient();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [err, setErr] = useState('');

  useEffect(() => { sb.auth.getUser().then(({ data }) => { if (data.user) location.href = '/app'; }); }, []);

  const google = () => sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/auth/callback' } });
  const send = async (e) => {
    e.preventDefault(); setErr('');
    const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    error ? setErr(error.message) : setStep('code');
  };
  const verify = async (e) => {
    e.preventDefault(); setErr('');
    const { error } = await sb.auth.verifyOtp({ email, token: code, type: 'email' });
    error ? setErr(error.message) : (location.href = '/app');
  };

  return (
    <main className="center"><div style={{ display: "grid", gap: 24, maxWidth: 900, width: "100%", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", alignItems: "center" }}>
      <iframe src="/clearlist.html?explainer=1" title="Why Clearlist" style={{ width: "100%", height: 380, border: 0, borderRadius: 20 }} />
      <div className="card" style={{ margin: "0 auto" }}>
      <img className="logo" src="/logo.png" alt="Clearlist" />
      <h1>Welcome</h1>
      {step === 'email' ? (<>
        <p>Sign in or create your account.</p>
        <button onClick={google}>Continue with Google</button>
        <p style={{ textAlign: 'center', margin: '4px 0 12px' }}>or</p>
        <form onSubmit={send}>
          <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">Email me a code</button>
        </form>
      </>) : (<>
        <p>Enter the 6-digit code we sent to {email}.</p>
        <form onSubmit={verify}>
          <input inputMode="numeric" maxLength={8} required placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button type="submit">Verify</button>
        </form>
      </>)}
      <p style={{ textAlign: "center", fontSize: 12, margin: "10px 0 0" }}>By continuing you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
      <a href="/clearlist.html?demo=1" style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 14, color: "#6b8299" }}>Try the demo, no account needed</a>
      {err && <div className="err">{err}</div>}
    </div></div></main>
  );
}

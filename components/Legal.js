export default function Legal({ title, children }) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px', lineHeight: 1.65 }}>
      <a href="/"><img src="/logo.png" alt="Clearlist" style={{ height: 36 }} /></a>
      <h1 style={{ marginTop: 24 }}>{title}</h1>
      <p style={{ color: '#6b8299' }}>Last updated: November 11, 2026</p>
      <div style={{ color: '#0c2d48' }}>{children}</div>
    </main>
  );
}

export default function NotFound() {
  return (
    <main className="sec" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div className="wrap" style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
        <span className="kufi" lang="ar" style={{ font: '700 2rem/1 var(--f-kufi)', color: 'var(--saffron)' }}>باب مغلق</span>
        <h1 style={{ font: '700 2rem/1.2 var(--f-display)' }}>This door is closed.</h1>
        <a className="btn primary" href="/">Back to the doors</a>
      </div>
    </main>
  );
}

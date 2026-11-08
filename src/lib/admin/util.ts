/** Title for lists in the dashboard: Arabic first, then English, then Indonesian. Plain strings pass through. */
export function label(v: unknown): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') { const o = v as Record<string, string>; return o.ar || o.en || o.id || ''; }
  return String(v);
}

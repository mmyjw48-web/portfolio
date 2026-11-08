'use client';
import { useState } from 'react';

export default function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="mini" type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1800); }
      catch { /* clipboard blocked: the address stays selectable */ }
    }}>{copied ? done : label}</button>
  );
}

"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

// Tombol Bagikan: menyalin tautan halaman ke clipboard (PRD 5.4.1).
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bisa ditolak (mis. konteks tidak aman). Tidak ada fallback: tombol diam saja.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" strokeWidth={1.75} />
      ) : (
        <Share2 className="h-4 w-4" strokeWidth={1.75} />
      )}
      <span aria-live="polite">{copied ? "Tautan disalin" : "Bagikan"}</span>
    </button>
  );
}

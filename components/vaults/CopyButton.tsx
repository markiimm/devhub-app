"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível — sem problema, botão só não confirma visualmente.
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 flex items-center gap-1.5 rounded-sm border border-border-strong bg-surface-3 px-2 py-1 text-xs text-ink-secondary hover:text-ink-primary"
    >
      <Icon name={copied ? "check" : "copy"} size={12} />
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

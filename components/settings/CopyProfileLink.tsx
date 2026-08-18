"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function CopyProfileLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const url = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível — sem problema, botão só não confirma visualmente.
    }
  }

  return (
    <button onClick={handleCopy} className="btn btn-ghost font-mono text-xs">
      <Icon name={copied ? "check" : "copy"} size={13} />
      {copied ? "copiado" : "copiar link"}
    </button>
  );
}

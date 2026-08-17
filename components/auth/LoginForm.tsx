"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          required
          className="input"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          required
          className="input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-status-critical">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

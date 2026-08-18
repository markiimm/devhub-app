"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Se a confirmação de e-mail estiver desligada no projeto, já vem uma sessão pronta.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <p className="font-mono text-sm text-ink-secondary">
        <span className="text-status-good">✓</span> Conta criada. Enviamos um link de confirmação para{" "}
        <span className="text-ink-primary">{email}</span> — clique nele para ativar o acesso.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">$ name</label>
        <input
          id="name"
          type="text"
          required
          className="input font-mono"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="email">$ email</label>
        <input
          id="email"
          type="email"
          required
          className="input font-mono"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">$ password</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          className="input font-mono"
          placeholder="mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="font-mono text-sm text-status-critical">✗ {error}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center font-mono">
        {loading ? "criando conta..." : "$ criar conta →"}
      </button>
    </form>
  );
}

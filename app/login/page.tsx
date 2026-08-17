import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SetupScreen } from "@/components/SetupScreen";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  if (!isSupabaseConfigured) return <SetupScreen />;

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse seu espaço pessoal de desenvolvimento."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}

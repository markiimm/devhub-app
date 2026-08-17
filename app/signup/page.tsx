import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SetupScreen } from "@/components/SetupScreen";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  if (!isSupabaseConfigured) return <SetupScreen />;

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a organizar seu conhecimento e seus projetos."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}

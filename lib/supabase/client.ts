import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./env";

// Sem generic <Database> de propósito: o schema hand-rolled em ./types serve como
// referência de shape (usado nas Server Actions), mas manter os clients do supabase-js
// sem o generic evita brigas de inferência do TS enquanto o schema evolui. Depois de
// rodar `supabase gen types typescript` você pode plugar o tipo gerado aqui.
export function createClient() {
  return createBrowserClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-anon-key"
  );
}

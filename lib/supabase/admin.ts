import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Cliente Supabase com a service role key — ignora Row Level Security.
 * Uso restrito: só o webhook da Stripe (que não tem sessão de usuário logado
 * pra provar quem é) precisa escrever na tabela `subscriptions` de qualquer um.
 * Nunca importe isso fora de uma rota de servidor confiável, e nunca exponha
 * SUPABASE_SERVICE_ROLE_KEY com o prefixo NEXT_PUBLIC_.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!serviceRoleKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY em .env.local.");
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

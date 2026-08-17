export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * true assim que as duas variáveis de ambiente foram preenchidas com algo
 * que não seja o placeholder do .env.local.example.
 */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes("SEU-PROJETO") &&
  !supabaseAnonKey.includes("SUA-CHAVE");

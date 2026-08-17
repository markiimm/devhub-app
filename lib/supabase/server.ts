import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers.
 * Lê/escreve a sessão via cookies do Next.js.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-anon-key",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // chamado de um Server Component — o middleware já cuida do refresh da sessão.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // idem acima.
          }
        },
      },
    }
  );
}

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="btn btn-ghost" title="Sair">
      <Icon name="logOut" size={15} />
      Sair
    </button>
  );
}

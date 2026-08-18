"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleReaction(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const updateId = String(formData.get("update_id"));
  const reacted = formData.get("reacted") === "true";

  if (reacted) {
    await supabase.from("reactions").delete().eq("update_id", updateId).eq("user_id", user.id);
  } else {
    await supabase.from("reactions").insert({ update_id: updateId, user_id: user.id });
  }

  revalidatePath("/feed");
}

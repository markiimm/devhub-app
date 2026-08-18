"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFollow(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const targetId = String(formData.get("target_id"));
  const handle = String(formData.get("handle"));
  const alreadyFollowing = formData.get("following") === "true";

  if (alreadyFollowing) {
    await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetId);
  } else {
    await supabase.from("follows").insert({ follower_id: user.id, following_id: targetId });
  }

  revalidatePath(`/u/${handle}`);
  revalidatePath("/feed");
}

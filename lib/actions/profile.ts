"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function parseList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const handle = String(formData.get("handle") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  const { error } = await supabase
    .from("profiles")
    .update({
      name: String(formData.get("name") ?? "").trim() || "Novo dev",
      handle: handle || null,
      title: String(formData.get("title") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      location: String(formData.get("location") ?? ""),
      stacks: parseList(formData.get("stacks")),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(
      error.code === "23505" ? "Esse handle já está em uso — escolha outro." : error.message
    );
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

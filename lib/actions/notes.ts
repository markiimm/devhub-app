"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function saveNote(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const id = String(formData.get("id") ?? "");
  const payload = {
    title: String(formData.get("title") ?? "Sem título"),
    category: String(formData.get("category") ?? ""),
    tags: parseTags(formData.get("tags")),
    body: String(formData.get("body") ?? ""),
    updated_at: new Date().toISOString(),
  };

  let noteId = id;
  if (id) {
    await supabase.from("notes").update(payload).eq("id", id).eq("user_id", user.id);
  } else {
    const { data } = await supabase
      .from("notes")
      .insert({ ...payload, user_id: user.id })
      .select("id")
      .single();
    noteId = data?.id ?? "";
  }

  revalidatePath("/brain");
  redirect(`/brain?id=${noteId}`);
}

export async function deleteNote(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const id = String(formData.get("id") ?? "");
  await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/brain");
  redirect("/brain");
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function parseList(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return { supabase, user };
}

// ---------- Code Vault ----------
export async function createSnippet(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("snippets").insert({
    user_id: user.id,
    title: String(formData.get("title") ?? "Snippet sem título"),
    lang: String(formData.get("lang") ?? "TypeScript"),
    description: String(formData.get("description") ?? ""),
    code: String(formData.get("code") ?? ""),
    tags: parseList(formData.get("tags")),
  });
  revalidatePath("/vaults");
}

export async function deleteSnippet(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("snippets").delete().eq("id", String(formData.get("id"))).eq("user_id", user.id);
  revalidatePath("/vaults");
}

// ---------- Error Vault ----------
export async function createErrorEntry(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("errors").insert({
    user_id: user.id,
    title: String(formData.get("title") ?? "Erro sem título"),
    tech: String(formData.get("tech") ?? ""),
    severity: String(formData.get("severity") ?? "warning"),
    cause: String(formData.get("cause") ?? ""),
    solution: String(formData.get("solution") ?? ""),
  });
  revalidatePath("/vaults");
}

export async function deleteErrorEntry(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("errors").delete().eq("id", String(formData.get("id"))).eq("user_id", user.id);
  revalidatePath("/vaults");
}

// ---------- Idea Vault ----------
export async function createIdea(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("ideas").insert({
    user_id: user.id,
    title: String(formData.get("title") ?? "Ideia sem título"),
    category: String(formData.get("category") ?? "SaaS"),
    description: String(formData.get("description") ?? ""),
    problem: String(formData.get("problem") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    tech: parseList(formData.get("tech")),
  });
  revalidatePath("/vaults");
}

export async function deleteIdea(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("ideas").delete().eq("id", String(formData.get("id"))).eq("user_id", user.id);
  revalidatePath("/vaults");
}

// ---------- Tool Vault ----------
export async function createTool(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("tools").insert({
    user_id: user.id,
    name: String(formData.get("name") ?? "Ferramenta sem nome"),
    category: String(formData.get("category") ?? ""),
    status: String(formData.get("status") ?? "Quero testar"),
    notes: String(formData.get("notes") ?? ""),
  });
  revalidatePath("/vaults");
}

export async function deleteTool(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase.from("tools").delete().eq("id", String(formData.get("id"))).eq("user_id", user.id);
  revalidatePath("/vaults");
}

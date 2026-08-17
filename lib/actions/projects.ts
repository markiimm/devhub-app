"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: String(formData.get("name") ?? "Novo projeto"),
      tagline: String(formData.get("tagline") ?? ""),
      tech: parseList(formData.get("tech")),
      github: String(formData.get("github") ?? ""),
    })
    .select("id")
    .single();
  revalidatePath("/projects");
  redirect(`/projects/${data?.id}`);
}

export async function deleteProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id"));
  await supabase.from("projects").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/projects");
  redirect("/projects");
}

export async function updateProjectMeta(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id"));
  await supabase
    .from("projects")
    .update({
      name: String(formData.get("name") ?? ""),
      tagline: String(formData.get("tagline") ?? ""),
      status: String(formData.get("status") ?? "Em desenvolvimento"),
      progress: Number(formData.get("progress") ?? 0),
      tech: parseList(formData.get("tech")),
      github: String(formData.get("github") ?? ""),
      dna: {
        arquitetura: String(formData.get("dna_arquitetura") ?? ""),
        banco: String(formData.get("dna_banco") ?? ""),
        auth: String(formData.get("dna_auth") ?? ""),
        hospedagem: String(formData.get("dna_hospedagem") ?? ""),
        ferramentas: String(formData.get("dna_ferramentas") ?? ""),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath(`/projects/${id}`);
}

// ---- tasks ----
export async function addTask(formData: FormData) {
  const { supabase } = await requireUser();
  const projectId = String(formData.get("project_id"));
  await supabase.from("project_tasks").insert({ project_id: projectId, title: String(formData.get("title") ?? "") });
  revalidatePath(`/projects/${projectId}`);
}

export async function toggleTask(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  const projectId = String(formData.get("project_id"));
  const done = formData.get("done") === "true";
  await supabase.from("project_tasks").update({ done: !done }).eq("id", id);
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTask(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  const projectId = String(formData.get("project_id"));
  await supabase.from("project_tasks").delete().eq("id", id);
  revalidatePath(`/projects/${projectId}`);
}

// ---- problems ----
export async function addProblem(formData: FormData) {
  const { supabase } = await requireUser();
  const projectId = String(formData.get("project_id"));
  await supabase.from("project_problems").insert({ project_id: projectId, title: String(formData.get("title") ?? "") });
  revalidatePath(`/projects/${projectId}`);
}

export async function cycleProblemStatus(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  const projectId = String(formData.get("project_id"));
  const current = String(formData.get("status"));
  const next = current === "Aberto" ? "Investigando" : current === "Investigando" ? "Resolvido" : "Aberto";
  await supabase.from("project_problems").update({ status: next }).eq("id", id);
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteProblem(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  const projectId = String(formData.get("project_id"));
  await supabase.from("project_problems").delete().eq("id", id);
  revalidatePath(`/projects/${projectId}`);
}

// ---- build in public updates ----
export async function addUpdate(formData: FormData) {
  const { supabase } = await requireUser();
  const projectId = String(formData.get("project_id"));
  await supabase.from("project_updates").insert({ project_id: projectId, body: String(formData.get("body") ?? "") });
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteUpdate(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id"));
  const projectId = String(formData.get("project_id"));
  await supabase.from("project_updates").delete().eq("id", id);
  revalidatePath(`/projects/${projectId}`);
}

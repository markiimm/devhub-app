import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { saveNote, deleteNote } from "@/lib/actions/notes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dev Brain" };

export default async function BrainPage({ searchParams }: { searchParams: { id?: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, category, updated_at")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  const selectedId = searchParams.id;
  const isNew = selectedId === "new";
  const selected =
    !isNew && selectedId ? (await supabase.from("notes").select("*").eq("id", selectedId).single()).data : null;

  return (
    <div>
      <Topbar
        title="Dev Brain"
        subtitle="Guarde conhecimentos, comandos, links e conceitos técnicos — organizados por tags."
        accent="brain"
        actions={
          <Link href="/brain?id=new" className="btn btn-primary">
            <Icon name="plus" size={14} />
            Nova nota
          </Link>
        }
      />
      <div className="grid grid-cols-[280px_1fr] gap-6 p-8 sm:p-10">
        <div className="card animate-fade-up !p-2">
          {notes && notes.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {notes.map((n, i) => (
                <Link
                  key={n.id}
                  href={`/brain?id=${n.id}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`animate-fade-up rounded-sm border px-3 py-2.5 text-sm transition-all ${
                    n.id === selectedId
                      ? "border-section-brain/40 bg-section-brain/10"
                      : "border-transparent hover:border-border hover:bg-surface-3"
                  }`}
                >
                  <div className="truncate font-medium">{n.title}</div>
                  <div className="mt-0.5 text-xs text-ink-muted">{n.category || "Sem categoria"}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-ink-muted">Nenhuma nota ainda.</div>
          )}
        </div>

        {isNew || selected ? (
          <form action={saveNote} className="card animate-fade-up space-y-4" style={{ animationDelay: "80ms" }}>
            <input type="hidden" name="id" defaultValue={selected?.id ?? ""} />
            <div className="flex items-center justify-between gap-3">
              <input
                name="title"
                required
                defaultValue={selected?.title ?? ""}
                placeholder="Título da nota"
                className="input !border-0 !bg-transparent !px-0 text-lg font-semibold"
              />
              {selected && (
                <button
                  formAction={deleteNote}
                  className="btn btn-ghost text-status-critical hover:text-status-critical"
                  title="Excluir"
                >
                  <Icon name="trash" size={14} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Categoria</label>
                <input name="category" defaultValue={selected?.category ?? ""} className="input" placeholder="ex: DevOps" />
              </div>
              <div>
                <label className="label">Tags (separadas por vírgula)</label>
                <input
                  name="tags"
                  defaultValue={selected?.tags?.join(", ") ?? ""}
                  className="input"
                  placeholder="git, deploy, checklist"
                />
              </div>
            </div>
            <div>
              <label className="label">Conteúdo</label>
              <textarea
                name="body"
                defaultValue={selected?.body ?? ""}
                rows={14}
                className="input resize-y font-mono text-sm leading-relaxed"
                placeholder="Escreva aqui..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Link href="/brain" className="btn btn-ghost">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-primary">
                Salvar nota
              </button>
            </div>
          </form>
        ) : (
          <EmptyState
            icon="code"
            title="Selecione uma nota"
            description="Ou crie uma nova para começar a guardar seu conhecimento."
          />
        )}
      </div>
    </div>
  );
}

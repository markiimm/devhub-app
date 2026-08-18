import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { Icon } from "@/components/ui/Icon";
import { CopyProfileLink } from "@/components/settings/CopyProfileLink";
import { updateProfile } from "@/lib/actions/profile";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  return (
    <div>
      <Topbar
        title="Configurações"
        subtitle="Seu perfil — o que aparece publicamente no seu link compartilhável."
      />
      <div className="space-y-5 p-8 sm:p-10">
        {profile?.handle && (
          <div className="card card-hover flex animate-fade-up items-center justify-between">
            <div>
              <div className="text-sm font-medium">Seu perfil público</div>
              <div className="mt-1 font-mono text-xs text-ink-muted">/u/{profile.handle}</div>
            </div>
            <div className="flex items-center gap-2">
              <CopyProfileLink path={`/u/${profile.handle}`} />
              <Link href={`/u/${profile.handle}`} target="_blank" className="btn btn-primary">
                Ver perfil
                <Icon name="chevronRight" size={13} />
              </Link>
            </div>
          </div>
        )}

        <form action={updateProfile} className="card animate-fade-up space-y-4" style={{ animationDelay: "60ms" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nome</label>
              <input name="name" defaultValue={profile?.name ?? ""} className="input" placeholder="Seu nome" />
            </div>
            <div>
              <label className="label">Handle</label>
              <input
                name="handle"
                defaultValue={profile?.handle ?? ""}
                className="input font-mono"
                placeholder="seu-handle"
              />
            </div>
          </div>
          <div>
            <label className="label">Cargo / título</label>
            <input
              name="title"
              defaultValue={profile?.title ?? ""}
              className="input"
              placeholder="ex: Full-stack developer"
            />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ""}
              rows={3}
              className="input resize-y"
              placeholder="Uma frase (ou duas) sobre você"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Localização</label>
              <input
                name="location"
                defaultValue={profile?.location ?? ""}
                className="input"
                placeholder="ex: São Paulo, Brasil"
              />
            </div>
            <div>
              <label className="label">Stack (separado por vírgula)</label>
              <input
                name="stacks"
                defaultValue={profile?.stacks?.join(", ") ?? ""}
                className="input"
                placeholder="TypeScript, React, Node"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary">Salvar perfil</button>
          </div>
        </form>
      </div>
    </div>
  );
}

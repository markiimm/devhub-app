import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/Topbar";
import { Icon } from "@/components/ui/Icon";
import { CopyProfileLink } from "@/components/settings/CopyProfileLink";
import { updateProfile } from "@/lib/actions/profile";
import { createCheckoutSession, createPortalSession } from "@/lib/actions/billing";
import { getSubscription, isPro } from "@/lib/billing";
import { isStripeConfigured } from "@/lib/stripe/env";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const subscription = await getSubscription(user!.id);
  const userIsPro = isPro(subscription?.status);

  return (
    <div>
      <Topbar
        title="Configurações"
        subtitle="Seu perfil — o que aparece publicamente no seu link compartilhável."
      />
      <div className="space-y-5 p-8 sm:p-10">
        <div className="card card-hover flex animate-fade-up items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              Plano {userIsPro ? "Pro" : "Free"}
              {userIsPro && (
                <span className="rounded-full border border-status-warning/40 bg-status-warning/10 px-2 py-0.5 text-[10px] text-status-warning">
                  PRO
                </span>
              )}
            </div>
            <div className="mt-1 font-mono text-xs text-ink-muted">
              {userIsPro
                ? subscription?.current_period_end
                  ? `renova em ${new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}`
                  : "assinatura ativa"
                : "sem custo — sempre pode assinar o Pro depois"}
            </div>
          </div>
          {userIsPro ? (
            <form action={createPortalSession}>
              <button className="btn btn-ghost font-mono">gerenciar assinatura →</button>
            </form>
          ) : isStripeConfigured ? (
            <form action={createCheckoutSession}>
              <button className="btn btn-primary font-mono">$ assinar Pro →</button>
            </form>
          ) : (
            <Link href="/pricing" className="btn btn-ghost font-mono">
              ver planos →
            </Link>
          )}
        </div>

        {profile?.handle && (
          <div className="card card-hover flex animate-fade-up items-center justify-between" style={{ animationDelay: "60ms" }}>
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

        <form action={updateProfile} className="card animate-fade-up space-y-4" style={{ animationDelay: "120ms" }}>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Usuário do GitHub</label>
              <input
                name="github_username"
                defaultValue={profile?.github_username ?? ""}
                className="input font-mono"
                placeholder="seu-usuario"
              />
              <p className="mt-1.5 text-xs text-ink-muted">
                Opcional — puxa seus commits públicos reais pro heatmap do Dashboard.
              </p>
            </div>
            <div>
              <label className="label">Cor do perfil</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  name="avatar_color"
                  defaultValue={profile?.avatar_color || "#22d3ee"}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-sm border border-border bg-surface-3 p-1"
                />
                <span className="font-mono text-xs text-ink-muted">cor do seu avatar no perfil público</span>
              </div>
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

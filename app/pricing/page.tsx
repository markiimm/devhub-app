import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { PublicHeader } from "@/components/marketing/PublicHeader";
import { Icon } from "@/components/ui/Icon";
import { isStripeConfigured } from "@/lib/stripe/env";
import { getSubscription, isPro } from "@/lib/billing";
import { createCheckoutSession } from "@/lib/actions/billing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Planos" };

const FREE_PERKS = [
  "Projetos, Dev Brain e Vaults ilimitados",
  "Perfil público com link compartilhável",
  "Dev Feed, Comunidade e Biblioteca pública",
  "Heatmap de atividade (interno + GitHub)",
];

const PRO_PERKS = [
  "Selo PRO no seu perfil público",
  "Destaque prioritário na Comunidade",
  "Cores e identidade visual exclusivas (em breve)",
  "Analytics do perfil — visitas e crescimento (em breve)",
  "Apoia diretamente o desenvolvimento do devHub",
];

export default async function PricingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subscription = user ? await getSubscription(user.id) : null;
  const userIsPro = isPro(subscription?.status);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground color="#fbbf24" />
      <PublicHeader />

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-4 sm:px-10">
        <div className="animate-fade-up text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Planos</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-secondary">
            O devHub é gratuito pra usar de verdade. O plano Pro existe pra quem quer apoiar e ganhar uns extras.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="card animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Free</h2>
              <span className="font-mono text-sm text-ink-muted">R$0</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-ink-secondary">
              {FREE_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <Icon name="check" size={14} className="mt-0.5 shrink-0 text-status-good" />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {user ? (
                <span className="btn btn-ghost w-full cursor-default justify-center">seu plano atual</span>
              ) : (
                <Link href="/signup" className="btn btn-ghost w-full justify-center font-mono">
                  $ criar conta →
                </Link>
              )}
            </div>
          </div>

          <div
            className="card card-hover animate-fade-up border-status-warning/30"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                Pro <span className="rounded-full border border-status-warning/40 bg-status-warning/10 px-2 py-0.5 text-[10px] text-status-warning">PRO</span>
              </h2>
              <span className="font-mono text-sm text-ink-muted">R$29/mês</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-ink-secondary">
              {PRO_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <Icon name="star" size={14} className="mt-0.5 shrink-0 text-status-warning" />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {userIsPro ? (
                <Link href="/settings" className="btn btn-primary w-full justify-center font-mono">
                  gerenciar assinatura →
                </Link>
              ) : isStripeConfigured ? (
                <form action={createCheckoutSession}>
                  <button className="btn btn-primary w-full justify-center font-mono">$ assinar Pro →</button>
                </form>
              ) : (
                <span className="btn btn-ghost w-full cursor-default justify-center opacity-60">em breve</span>
              )}
            </div>
          </div>
        </div>

        {!isStripeConfigured && (
          <p className="mt-8 text-center font-mono text-xs text-ink-muted">
            $ pagamentos ainda não configurados neste ambiente
          </p>
        )}
      </main>
    </div>
  );
}

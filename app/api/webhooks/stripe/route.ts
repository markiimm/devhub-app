import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { stripeWebhookSecret } from "@/lib/stripe/env";
import { createAdminClient } from "@/lib/supabase/admin";

function toIso(unixSeconds: number | null | undefined) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}

async function upsertFromSubscription(subscription: Stripe.Subscription, userIdHint?: string | null) {
  const supabase = createAdminClient();
  const userId = userIdHint ?? subscription.metadata?.supabase_user_id;

  const row = {
    stripe_customer_id: String(subscription.customer),
    stripe_subscription_id: subscription.id,
    price_id: subscription.items.data[0]?.price.id ?? null,
    status: subscription.status,
    current_period_end: toIso(subscription.current_period_end),
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    await supabase.from("subscriptions").upsert({ user_id: userId, ...row });
  } else {
    // fallback pra eventos que não carregam o metadata (ex: mudanças feitas direto no dashboard da Stripe)
    await supabase.from("subscriptions").update(row).eq("stripe_customer_id", String(subscription.customer));
  }
}

export async function POST(req: Request) {
  if (!stripeWebhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET não configurado." }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Assinatura inválida: ${(err as Error).message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
          await upsertFromSubscription(subscription, session.client_reference_id);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertFromSubscription(subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Falha ao processar evento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

import { createClient } from "@/lib/supabase/server";

export type SubscriptionStatus = "none" | "trialing" | "active" | "past_due" | "canceled" | "incomplete";

export interface Subscription {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  price_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = createClient();
  const { data } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
  return data;
}

export function isPro(status?: SubscriptionStatus | null) {
  return status === "active" || status === "trialing";
}

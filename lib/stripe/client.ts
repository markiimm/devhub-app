import Stripe from "stripe";
import { stripeSecretKey } from "./env";

/**
 * Cliente Stripe pro servidor (Server Actions / Route Handlers).
 * Nunca importe isso de um componente client — a secret key não pode vazar pro browser.
 */
export function getStripe() {
  if (!stripeSecretKey) {
    throw new Error("Stripe não configurado — falta STRIPE_SECRET_KEY em .env.local.");
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });
}

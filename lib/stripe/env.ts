export const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
export const stripePriceIdPro = process.env.STRIPE_PRICE_ID_PRO ?? "";
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

/**
 * true assim que as três chaves essenciais (secret key, publishable key e o price
 * do plano Pro) foram preenchidas. O webhook secret não entra aqui porque só existe
 * depois que o endpoint é registrado na Stripe — sem ele o checkout ainda funciona,
 * só a confirmação automática do pagamento que fica pendente.
 */
export const isStripeConfigured =
  stripeSecretKey.length > 0 && stripePublishableKey.length > 0 && stripePriceIdPro.length > 0;

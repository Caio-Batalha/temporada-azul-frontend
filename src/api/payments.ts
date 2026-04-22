import { apiFetch } from "./client";
import { checkoutResponseSchema } from "./schemas";

export type CheckoutResponse = {
  checkout_url: string;
  session_id: string;
};

export const createCheckoutSession = async (bookingId: number): Promise<CheckoutResponse> => {
  const data = await apiFetch<CheckoutResponse>("/payments/checkout-session", {
    method: "POST",
    body: JSON.stringify({ booking_id: bookingId }),
  });
  return checkoutResponseSchema.parse(data);
};

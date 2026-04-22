import { z } from "zod";

export const tourSchema = z.object({
  id: z.number(),
  tour_date: z.string(),
  departure_time: z.string(),
  boat_name: z.string(),
  boat_id: z.number(),
  capacity: z.number(),
  seats_left: z.number(),
});

export const toursSchema = z.array(tourSchema);

export const passengerSchema = z.object({
  full_name: z.string().min(1),
  cpf: z.string().min(1).nullable().optional(),
  whatsapp: z.string().min(1).nullable().optional(),
});

export const holdRequestSchema = z.object({
  tour_id: z.number(),
  ticket_count: z.number().min(1),
  offer_code: z.enum(["standard", "trio_deal", "group_deal"]),
  buyer_full_name: z.string().min(1),
  buyer_cpf: z.string().min(1),
  buyer_whatsapp: z.string().min(1),
  passengers: z.array(passengerSchema),
});

export const holdResponseSchema = z.object({
  booking_id: z.number(),
  tour_id: z.number(),
  ticket_count: z.number(),
  offer_code: z.string(),
  discount_bps: z.number(),
  total_amount_cents: z.number(),
  hold_expires_at: z.string(),
  seats_left: z.number(),
});

export const checkoutResponseSchema = z.object({
  checkout_url: z.string().url(),
  session_id: z.string(),
});

export const bookingStatusSchema = z.object({
  booking_id: z.number(),
  tour_id: z.number(),
  ticket_count: z.number(),
  total_amount_cents: z.number(),
  status: z.string(),
  hold_expires_at: z.string().nullable().optional(),
  stripe_session_id: z.string().nullable().optional(),
});

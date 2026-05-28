import { apiFetch } from "./client";
import { bookingStatusSchema, holdRequestSchema, holdResponseSchema } from "./schemas";

export type HoldRequest = {
  tour_id: number;
  ticket_count: number;
  offer_code: "standard" | "trio_deal" | "group_deal";
  buyer_full_name: string;
  buyer_cpf: string;
  buyer_whatsapp: string;
  passengers: Array<{
    full_name: string;
    cpf?: string | null;
    whatsapp?: string | null;
  }>;
};

export type HoldResponse = {
  booking_id: number;
  tour_id: number;
  ticket_count: number;
  offer_code: string;
  discount_bps: number;
  total_amount_cents: number;
  hold_expires_at: string;
  seats_left: number;
};

export type BookingStatus = {
  booking_id: number;
  tour_id: number;
  ticket_count: number;
  total_amount_cents: number;
  status: string;
  hold_expires_at?: string | null;
  mp_preference_id?: string | null;
};

export const createHold = async (payload: HoldRequest): Promise<HoldResponse> => {
  holdRequestSchema.parse(payload);
  const data = await apiFetch<HoldResponse>("/bookings/hold", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return holdResponseSchema.parse(data);
};

export const fetchBookingStatus = async (bookingId: number): Promise<BookingStatus> => {
  const data = await apiFetch<BookingStatus>(`/bookings/${bookingId}/status`);
  return bookingStatusSchema.parse(data);
};

export const fetchBookingStatusBySession = async (sessionId: string): Promise<BookingStatus> => {
  const data = await apiFetch<BookingStatus>(`/bookings/status?session_id=${encodeURIComponent(sessionId)}`);
  return bookingStatusSchema.parse(data);
};

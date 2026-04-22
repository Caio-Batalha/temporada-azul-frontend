import { apiFetch } from "./client";
import { toursSchema } from "./schemas";

export type Tour = {
  id: number;
  tour_date: string;
  departure_time: string;
  boat_name: string;
  boat_id: number;
  capacity: number;
  seats_left: number;
};

export const fetchAvailableTours = async (): Promise<Tour[]> => {
  const data = await apiFetch<Tour[]>("/tours/available");
  return toursSchema.parse(data);
};

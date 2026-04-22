import { createContext, useContext } from "react";

type ReservationContextValue = {
  open: boolean;
  openReservation: () => void;
  closeReservation: () => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

export const useReservation = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error("useReservation must be used within ReservationContext.Provider");
  }
  return ctx;
};

export default ReservationContext;


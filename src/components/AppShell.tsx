import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ReservationModal from "./ReservationModal";
import MobileBottomBar from "./MobileBottomBar";
import ScrollToTop from "./ScrollToTop";
import ReservationContext from "../app/reservation";

const AppShell = () => {
  const [reservationOpen, setReservationOpen] = useState(false);

  return (
    <ReservationContext.Provider
      value={{
        open: reservationOpen,
        openReservation: () => setReservationOpen(true),
        closeReservation: () => setReservationOpen(false),
      }}
    >
      <ScrollToTop />
      <ReservationModal open={reservationOpen} onClose={() => setReservationOpen(false)} />
      <div className="min-h-screen bg-sea-gradient text-ink-600">
      <Header />
      <main className="pt-20 pb-28 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
      </div>
    </ReservationContext.Provider>
  );
};

export default AppShell;

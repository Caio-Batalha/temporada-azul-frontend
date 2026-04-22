import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { buildWhatsAppUrl } from "../config/contact";
import { useReservation } from "../app/reservation";

const MobileBottomBar = () => {
  const { openReservation } = useReservation();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const shouldGateOnHome = location.pathname === "/";
    if (!shouldGateOnHome) {
      setVisible(true);
      return undefined;
    }

    const onScroll = () => {
      // Mobile-first: avoid competing with hero CTAs; show after user scrolls a bit.
      setVisible(window.scrollY > 220);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-deep-100 bg-white/90 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition duration-300 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-6xl gap-3">
        <a
          href={buildWhatsAppUrl(
            "Olá! Quero falar com a equipe da Temporada Azul. Pode me ajudar com informações e disponibilidade?",
          )}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d]"
        >
          Fale conosco
        </a>
        <button
          onClick={openReservation}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-deep-900 via-deep-700 to-ocean-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-glow transition hover:to-ocean-600"
        >
          Ver experiências
        </button>
      </div>
    </div>
  );
};

export default MobileBottomBar;

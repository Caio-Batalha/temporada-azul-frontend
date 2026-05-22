import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { buildWhatsAppUrl } from "../config/contact";
import { useReservation } from "../app/reservation";

const Header = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openReservation } = useReservation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-base tracking-wide uppercase ${isActive ? "text-deep-800" : "text-ink-600"} hover:text-deep-800`;

  const mobileLinkBase =
    "block rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-700 hover:bg-deep-50";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-deep-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl lg:max-w-7xl xl:max-w-[1440px] items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/media/icon.jpg"
            alt="Temporada Azul"
            className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-deep-100"
          />
          <div>
            <p className="font-display text-lg text-ink-700">{t("brand")}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-deep-700">
              Vitória, ES
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink to="/" className={linkClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/avista-baleias" className={linkClass}>
            {t("nav.whales")}
          </NavLink>
          <NavLink to="/pescarias" className={linkClass}>
            {t("nav.fishing")}
          </NavLink>
          <NavLink to="/praias" className={linkClass}>
            {t("nav.beaches")}
          </NavLink>
          <NavLink to="/churrasco-a-bordo" className={linkClass}>
            {t("nav.bbq")}
          </NavLink>
          <NavLink to="/sobre" className={linkClass}>
            {t("nav.about")}
          </NavLink>
          <NavLink to="/contato" className={linkClass}>
            {t("nav.contact")}
          </NavLink>
        </nav>

        <div className="hidden lg:block">
          <PrimaryButton to="/avista-baleias">{t("cta.bookNow")}</PrimaryButton>
        </div>

        <button
          className="rounded-full border border-deep-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-deep-800 hover:bg-white lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-deep-900/60 backdrop-blur-sm lg:hidden">
          <button
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute inset-x-0 top-0 z-10 rounded-b-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-deep-700">
                Navegação
              </p>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-deep-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-deep-800 hover:bg-deep-50"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              <NavLink to="/" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.home")}
              </NavLink>
              <NavLink to="/avista-baleias" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.whales")}
              </NavLink>
              <NavLink to="/pescarias" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.fishing")}
              </NavLink>
              <NavLink to="/praias" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.beaches")}
              </NavLink>
              <NavLink to="/churrasco-a-bordo" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.bbq")}
              </NavLink>
              <NavLink to="/sobre" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.about")}
              </NavLink>
              <NavLink to="/contato" className={mobileLinkBase} onClick={() => setMenuOpen(false)}>
                {t("nav.contact")}
              </NavLink>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openReservation();
                }}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-deep-900 via-deep-700 to-ocean-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-glow"
              >
                Ver experiências
              </button>
              <a
                href={buildWhatsAppUrl(
                  "Olá! Quero falar com a equipe da Temporada Azul. Pode me ajudar com informações e disponibilidade?",
                )}
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d]"
              >
                Fale conosco
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";
import { buildWhatsAppUrl } from "../config/contact";

type ReservationModalProps = {
  open: boolean;
  onClose: () => void;
};

const ReservationModal = ({ open, onClose }: ReservationModalProps) => {
  if (!open) return null;

  const cardClass =
    "rounded-2xl border border-deep-200/70 bg-white p-5 text-ink-700 shadow-sm transition hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-md";

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-deep-900/85 px-6 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-deep-200/30 bg-white/95 p-4 text-ink-700 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-deep-700">
              Experiências
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink-800 sm:text-3xl">
              Escolha a experiência
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              Baleias tem reserva online. As demais experiências são via WhatsApp.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-deep-200 px-4 py-2 text-xs uppercase tracking-[0.3em] text-deep-800 hover:bg-deep-50"
          >
            Fechar
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link to="/avista-baleias" onClick={onClose} className={cardClass}>
            <p className="text-xs uppercase tracking-[0.3em] text-deep-700">
              Reserva online
            </p>
            <p className="mt-2 font-display text-2xl text-ink-800">Avistamento de Baleias</p>
            <p className="mt-2 text-sm text-ink-600">
              Escolha a data, preencha os dados e pague com segurança.
            </p>
          </Link>

          <a
            href={buildWhatsAppUrl(
              "Olá! Quero fazer uma reserva de Pescarias com a Temporada Azul. Pode me passar detalhes e disponibilidade?",
            )}
            className={cardClass}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-deep-700">
              WhatsApp
            </p>
            <p className="mt-2 font-display text-2xl text-ink-800">Pescarias</p>
            <p className="mt-2 text-sm text-ink-600">
              Atendimento rápido para montar o roteiro ideal.
            </p>
          </a>

          <a
            href={buildWhatsAppUrl(
              "Olá! Quero fazer uma reserva de Passeios pelas Praias (Vitória/Vila Velha) com a Temporada Azul. Pode me passar detalhes e disponibilidade?",
            )}
            className={cardClass}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-deep-700">
              WhatsApp
            </p>
            <p className="mt-2 font-display text-2xl text-ink-800">Passeios pelas Praias</p>
            <p className="mt-2 text-sm text-ink-600">
              Rotas exclusivas com conforto e praticidade.
            </p>
          </a>

          <a
            href={buildWhatsAppUrl(
              "Olá! Quero fazer uma reserva de Festas/Eventos a Bordo com a Temporada Azul. Pode me passar detalhes e disponibilidade?",
            )}
            className={cardClass}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-deep-700">
              WhatsApp
            </p>
            <p className="mt-2 font-display text-2xl text-ink-800">Festas/Eventos a Bordo</p>
            <p className="mt-2 text-sm text-ink-600">
              Eventos elegantes no mar, sob medida para o seu grupo.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;

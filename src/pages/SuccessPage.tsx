import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingStatusBySession } from "../api/bookings";
import TourInstructionsModal from "../components/TourInstructionsModal";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const { data, isLoading } = useQuery({
    queryKey: ["booking-status", sessionId],
    queryFn: () => fetchBookingStatusBySession(sessionId ?? ""),
    enabled: Boolean(sessionId),
    refetchInterval: 3000,
  });

  const status = data?.status ?? "processing";
  const isPaid = !isLoading && status === "paid";

  const heading = isPaid ? "Pagamento confirmado" : "Reserva em processamento";
  const subheading = isPaid
    ? "Sua reserva está garantida. Em breve entraremos em contato com mais informações."
    : "Estamos confirmando seu pagamento com segurança.";

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-deep-700">Pagamento</p>
      <h1 className="mt-4 font-display text-4xl text-ink-700">{heading}</h1>
      <p className="mt-4 text-lg text-ink-600">{subheading}</p>

      <div className="mt-8 rounded-2xl border border-ocean-100 bg-white/80 p-6 text-sm text-ink-600">
        {isLoading && <p>Verificando status da reserva...</p>}
        {isPaid && (
          <p>
            Código da reserva: <strong>{data?.booking_id}</strong>
          </p>
        )}
        {!isLoading && !isPaid && status !== "processing" && (
          <p>
            Status atual: <strong>{status}</strong>. Se isso demorar mais de alguns minutos,
            entre em contato com a equipe.
          </p>
        )}
        {!sessionId && (
          <p>
            Não encontramos um session_id válido. Se precisar de suporte, fale conosco pelo WhatsApp.
          </p>
        )}
      </div>

      {isPaid && (
        <div className="mt-8">
          <TourInstructionsModal buttonLabel="Reler informações importantes do passeio" />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/"
          className="rounded-full border border-deep-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep-700"
        >
          Voltar ao início
        </Link>
        <Link
          to="/contato"
          className="rounded-full bg-ocean-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
        >
          Falar com a equipe
        </Link>
      </div>
    </section>
  );
};

export default SuccessPage;

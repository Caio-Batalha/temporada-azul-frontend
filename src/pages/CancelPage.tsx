import { Link } from "react-router-dom";

const CancelPage = () => {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-deep-700">Pagamento</p>
      <h1 className="mt-4 font-display text-4xl text-ink-700">Pagamento cancelado</h1>
      <p className="mt-4 text-lg text-ink-600">
        Seu pagamento foi cancelado. Você pode tentar novamente ou falar com nossa equipe.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/avista-baleias"
          className="rounded-full bg-ocean-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
        >
          Tentar novamente
        </Link>
        <Link
          to="/contato"
          className="rounded-full border border-deep-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep-700"
        >
          Falar com a equipe
        </Link>
      </div>
    </section>
  );
};

export default CancelPage;

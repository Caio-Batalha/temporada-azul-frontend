import { buildWhatsAppUrl, CONTACT_EMAIL, WHATSAPP_NUMBER_DISPLAY } from "../config/contact";

const ContactPage = () => {
  const whatsappUrl = buildWhatsAppUrl(
    "Olá! Gostaria de saber mais sobre os passeios da Temporada Azul.",
  );

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-deep-700">Contato</p>
      <h1 className="mt-4 font-display text-4xl text-ink-700">Vamos conversar</h1>
      <p className="mt-4 text-lg text-ink-600">
        Fale com a nossa equipe para montar a melhor experiência para você.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
          <h3 className="font-display text-2xl text-ink-700">WhatsApp</h3>
          <p className="mt-3 text-sm text-ink-600">
            Atendimento rápido e personalizado.
          </p>
          <a
            href={whatsappUrl}
            className="mt-6 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d]"
          >
            Falar agora
          </a>
          <p className="mt-4 text-xs text-ink-500">{WHATSAPP_NUMBER_DISPLAY}</p>
        </div>
        <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6 md:col-span-2">
          <h3 className="font-display text-2xl text-ink-700">E-mail</h3>
          <p className="mt-3 text-sm text-ink-600">
            Prefere enviar uma mensagem? Fale conosco por e-mail.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 inline-flex rounded-full border border-deep-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep-700"
          >
            Enviar e-mail
          </a>
          <p className="mt-4 text-xs text-ink-500">{CONTACT_EMAIL}</p>
        </div>
        <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6 md:col-span-2">
          <h3 className="font-display text-2xl text-ink-700">Instagram</h3>
          <p className="mt-3 text-sm text-ink-600">
            Acompanhe novidades, datas e bastidores.
          </p>
          <a
            href="https://instagram.com/temporadaazul"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full border border-deep-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep-700"
          >
            @temporadaazul
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

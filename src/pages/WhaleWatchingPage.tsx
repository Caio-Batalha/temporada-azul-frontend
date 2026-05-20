import WhaleWatchingForm from "../features/booking/WhaleWatchingForm";
import ImageCarousel from "../components/ImageCarousel";

const WhaleWatchingPage = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <ImageCarousel
            images={[
              "/media/whale-1.jpg",
              "/media/whales-2.jpg",
              "/media/whales-3.jpg",
            ]}
            alt="Passeio de avistamento de baleias"
            fallbackSrc="/media/whale-watching.svg"
            fit="cover"
            className="aspect-[16/9] w-full rounded-[32px] shadow-glow"
            intervalMs={6000}
          />

          <p className="mt-8 text-xs uppercase tracking-[0.4em] text-deep-700">
            Reserva Online
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-700 md:text-5xl">
            Avistamento de Baleias
          </h1>

          <div className="mt-8 rounded-[28px] border border-deep-100 bg-white/85 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-deep-700">
              Nosso Diferencial - Experiência conduzida por especialistas.
            </p>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
              <p>
                Somos pioneiros no turismo de avistamento de baleias no Espírito Santo.
                Nosso capitão é especialista em aproximação responsável, com experiência
                em trabalhos realizados junto ao Instituto Baleia Jubarte e ao projeto
                Amigos da Jubarte.
              </p>
              <p>
                Utilizamos técnicas que respeitam o comportamento natural dos animais,
                garantindo total segurança para as baleias e proporcionando encontros únicos
                — onde elas se sentem confortáveis para nos presentear com um verdadeiro
                espetáculo no mar.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-deep-100 bg-white/85 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-deep-700">📍 Informações do passeio</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-xl border border-deep-100 bg-deep-50/60 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-deep-700">
                    Horário de saída
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">07:00</p>
                </div>
                <div className="rounded-xl border border-deep-100 bg-deep-50/60 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-deep-700">
                    Horário de chegada
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">por volta de 14:00</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-deep-100 bg-deep-50/60 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-deep-700">
                    Local de saída
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">
                    Pier de Iemanjá — Orla de Camburi
                  </p>
                </div>
                <div className="rounded-xl border border-deep-100 bg-deep-50/60 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-deep-700">
                    Duração do passeio
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">
                    Cerca de 7 horas de experiência
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <WhaleWatchingForm />
        </div>
      </div>
    </section>
  );
};

export default WhaleWatchingPage;

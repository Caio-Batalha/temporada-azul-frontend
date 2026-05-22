import { useEffect, useRef, useState } from "react";
import ImageCarousel from "../components/ImageCarousel";
import { buildWhatsAppUrl } from "../config/contact";

const PartiesPage = () => {
  const whatsappUrl = buildWhatsAppUrl(
    "Olá! Tenho interesse em Festas/Eventos a Bordo com a Temporada Azul. Pode me passar detalhes e disponibilidade?",
  );

  // Cache-bust for when the media file is replaced but keeps the same name.
  const videoVersion = "2026-04-16-01";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    // Try to start playback automatically. Most browsers only allow autoplay when muted.
    const el = videoRef.current;
    if (!el) return;

    el.muted = muted;
    const playPromise = el.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // Autoplay might be blocked; user can still start playback manually if needed.
      });
    }
  }, [muted]);

  return (
    <section className="mx-auto max-w-6xl lg:max-w-7xl xl:max-w-[1440px] px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <p className="text-xs uppercase tracking-[0.4em] text-deep-700">
            Temporada Azul
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink-700 md:text-5xl">
            Festas/Eventos a Bordo
          </h1>
          <p className="mt-4 text-lg text-ink-600">
            Um jeito inesquecível de comemorar — com liberdade total para você
            criar o clima da sua festa no mar.
          </p>

          <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-600">
            <p>
              Já imaginou comemorar seu aniversário no mar? Ou simplesmente fazer
              uma festa diferente!
            </p>
            <p>
              Aqui você define tudo: o horário, o local onde o barco ficará
              ancorado, o clima da festa e a trilha sonora. Pode ser durante o
              dia, ao pôr do sol, à noite ou até atravessando a madrugada — nós
              montamos a experiência do seu jeito.
            </p>
            <p>
              Embarcação preparada para receber seu grupo com conforto, com gelo
              a bordo para manter suas bebidas sempre na temperatura ideal. É só
              trazer sua galera e aproveitar.
            </p>
            <p>
              <strong>Capacidade para até 20 pessoas.</strong>
            </p>
            <p>Fale com a nossa equipe e comece a planejar sua festa no mar.</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-800">
              Reservas pelo WhatsApp <span aria-hidden="true">→</span>
              <span className="ml-2 text-[11px] font-normal tracking-[0.2em] text-ink-500">
                (converse e reserve) 🎉🌊
              </span>
            </p>
            <a
              href={whatsappUrl}
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d]"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="relative overflow-hidden rounded-[28px] border border-deep-100 bg-deep-50/60 shadow-glow">
              <div className="aspect-[9/16] w-full">
                <video
                  key={`parties-video-${videoVersion}`}
                  ref={videoRef}
                  className="h-full w-full bg-deep-50 object-contain"
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  preload="metadata"
                  poster="/media/bbq.svg"
                  controls={false}
                >
                  <source src={`/media/parties-1.mp4?v=${videoVersion}`} type="video/mp4" />
                  Seu navegador não suporta vídeo HTML5.
                </video>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((prev) => !prev)}
                  className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-deep-800 shadow-sm ring-1 ring-deep-100 hover:bg-white"
                >
                  {muted ? "Ativar áudio" : "Silenciar"}
                </button>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-500">
              Vídeo vertical — exibido sem cortes.
            </p>
          </div>

          <div className="mt-8 hidden">
            <ImageCarousel
              images={["/media/bbq-1.jpg"]}
              alt="Festas/Eventos a Bordo"
              fallbackSrc="/media/bbq.svg"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartiesPage;

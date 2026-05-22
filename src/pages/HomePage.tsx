import { Link } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import DualImageCarousel from "../components/DualImageCarousel";
import { buildWhatsAppUrl } from "../config/contact";
import { useReservation } from "../app/reservation";

const HomePage = () => {
  const { openReservation } = useReservation();

  return (
    <div>
      <section className="relative overflow-hidden px-6 pb-16 pt-12">
        <div className="mx-auto grid max-w-6xl lg:max-w-7xl xl:max-w-[1440px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
          <div className="order-2 lg:order-1">
            <p className="text-xs uppercase tracking-[0.4em] text-deep-700">
              Temporada Azul
            </p>
            <h1 className="mt-4 font-display text-[2.35rem] leading-[1.05] tracking-tight text-ink-700 sm:text-5xl md:text-6xl">
              <span className="block">Tudo o que você busca no mar,</span>
              <span className="block">
                em um só lugar
              </span>
            </h1>
            <p className="mt-6 text-lg text-ink-600">
              Avistamento de baleias, passeios exclusivos, pesca e eventos a
              bordo em Vitória, ES. Tudo planejado com cuidado, conforto e
              segurança.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                onClick={openReservation}
                className="inline-flex w-full items-center justify-center rounded-full border border-deep-200 bg-white/70 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep-800 shadow-sm transition hover:bg-white sm:w-auto"
              >
                Escolha sua experiência
              </button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative lg:-mr-10 lg:mt-2">
              <div className="absolute inset-0 rounded-[32px] bg-deep-200/45 blur-2xl" />
              <video
                className="relative aspect-[4/3] w-full rounded-[32px] object-cover shadow-glow sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[4/3] lg:scale-[1.03]"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/media/boat-hero.svg"
                disablePictureInPicture
              >
                <source
                  src="/media/hero-mobile.mp4"
                  type="video/mp4"
                  media="(max-width: 640px)"
                />
                <source src="/media/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl lg:max-w-7xl xl:max-w-[1440px] px-6 py-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-ink-700">
            Experiências disponíveis
          </h2>
          <button
            onClick={openReservation}
            className="text-sm font-semibold text-deep-700 hover:text-deep-600"
          >
            Ver experiências
          </button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Avistamento de Baleias",
              description: "Roteiros especiais e guias experientes.",
              link: "/avista-baleias",
              images: [
                "/media/whale-1.jpg",
                "/media/whales-2.jpg",
                "/media/whales-3.jpg",
              ],
            },
            {
              title: "Pescarias",
              description: "Equipamentos de qualidade e rotas planejadas.",
              link: "/pescarias",
              images: [
                "/media/fishing-1.jpg",
                "/media/fishing-2.jpg",
                "/media/fishing-3.jpg",
              ],
            },
            {
              title: "Passeios pelas Praias",
              description: "Vitória e Vila Velha de um jeito exclusivo.",
              link: "/praias",
              images: [
                "/media/beach-1.jpg",
              ],
            },
            {
              title: "Festas/Eventos a Bordo",
              description: "Eventos intimistas e experiências sob medida.",
              link: "/churrasco-a-bordo",
              images: ["/media/parties-2.JPG"],
            },
          ].map((service) => (
            <Link
              key={service.title}
              to={service.link}
              className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400/60"
            >
              {service.link === "/pescarias" ? (
                <DualImageCarousel
                  pairs={[
                    ["/media/fishing-1.jpg", "/media/fishing-2.jpg"],
                    ["/media/fishing-2.jpg", "/media/fishing-3.jpg"],
                    ["/media/fishing-1.jpg", "/media/fishing-3.jpg"],
                  ]}
                  alt={service.title}
                  fallbackSrc="/media/fishing.svg"
                  consumeClick
                  className="h-36 w-full rounded-2xl shadow-[0_14px_34px_rgba(7,28,68,0.14)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_48px_rgba(7,28,68,0.16)] sm:h-40"
                  intervalMs={5000}
                />
              ) : (
                <ImageCarousel
                  images={service.images}
                  alt={service.title}
                  fallbackSrc={
                    service.link === "/avista-baleias"
                      ? "/media/whale-watching.svg"
                      : service.link === "/praias"
                      ? "/media/beach.svg"
                      : "/media/bbq.svg"
                  }
                  consumeClick
                  className="h-36 w-full rounded-2xl shadow-[0_14px_34px_rgba(7,28,68,0.14)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_48px_rgba(7,28,68,0.16)] sm:h-40"
                  intervalMs={5000}
                />
              )}
              <h3 className="mt-5 font-display text-xl text-ink-700">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-ink-600">
                {service.description}
              </p>
              <span className="mt-4 inline-block text-xs uppercase tracking-[0.3em] text-deep-600">
                Saiba mais
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm font-semibold text-ink-600">
            Fale conosco através de nosso WhatsApp <span aria-hidden="true">→</span>
          </p>
          <a
            href={buildWhatsAppUrl(
              "Olá! Quero falar com a equipe da Temporada Azul. Pode me ajudar com informações e disponibilidade?",
            )}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d] sm:w-auto"
          >
            <span aria-hidden="true">WhatsApp</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.43 0 .07 5.36.07 11.95c0 2.1.55 4.15 1.6 5.97L0 24l6.25-1.64a11.86 11.86 0 0 0 5.77 1.47h.01c6.6 0 11.96-5.36 11.96-11.95 0-3.19-1.24-6.19-3.47-8.4ZM12.03 21.7h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.77 9.77 0 0 1-1.5-5.14c0-5.4 4.4-9.8 9.82-9.8a9.76 9.76 0 0 1 6.94 2.88 9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.94-9.78 9.94Zm5.39-7.34c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.48-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

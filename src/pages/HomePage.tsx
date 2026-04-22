import { Link } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import { buildWhatsAppUrl } from "../config/contact";
import { useReservation } from "../app/reservation";

const HomePage = () => {
  const { openReservation } = useReservation();

  return (
    <div>
      <section className="relative overflow-hidden px-6 pb-16 pt-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
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
              <a
                href={buildWhatsAppUrl(
                  "Olá! Quero falar com a equipe da Temporada Azul. Pode me ajudar com informações e disponibilidade?",
                )}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d] sm:w-auto"
              >
                Fale conosco
              </a>
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

      <section className="mx-auto max-w-6xl px-6 py-14">
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
              className="group rounded-2xl border border-deep-100 bg-white/85 p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <ImageCarousel
                images={service.images}
                alt={service.title}
                fallbackSrc={
                  service.link === "/avista-baleias"
                    ? "/media/whale-watching.svg"
                    : service.link === "/pescarias"
                    ? "/media/fishing.svg"
                    : service.link === "/praias"
                    ? "/media/beach.svg"
                    : "/media/bbq.svg"
                }
                className="h-28 w-full rounded-xl"
                intervalMs={5000}
              />
              <h3 className="mt-4 font-display text-xl text-ink-700">
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
      </section>
    </div>
  );
};

export default HomePage;

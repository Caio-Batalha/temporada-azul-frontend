import ImageCarousel from "../components/ImageCarousel";
import { buildWhatsAppUrl } from "../config/contact";
import type { ReactNode } from "react";

type ServicePageProps = {
  title: string;
  subtitle: string;
  images: string[];
  fallbackImage: string;
  whatsappMessage: string;
  imageFrameClassName?: string;
  imageFit?: "cover" | "contain";
  content?: ReactNode;
};

const ServicePage = ({
  title,
  subtitle,
  images,
  fallbackImage,
  whatsappMessage,
  imageFrameClassName,
  imageFit,
  content,
}: ServicePageProps) => {
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  return (
    <section className="mx-auto max-w-6xl lg:max-w-7xl xl:max-w-[1440px] px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <p className="text-xs uppercase tracking-[0.4em] text-deep-700">Temporada Azul</p>
          <h1 className="mt-4 font-display text-4xl text-ink-700 md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-ink-600">{subtitle}</p>

          <div className="mt-8 space-y-6">
            {content ?? (
              <ul className="space-y-3 text-sm text-ink-600">
                <li>Equipe experiente e atendimento personalizado.</li>
                <li>Roteiros desenhados para conforto e exclusividade.</li>
                <li>Planejamento sob demanda para grupos e eventos.</li>
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-800">
                Reservas pelo WhatsApp <span aria-hidden="true">→</span>
                <span className="ml-2 text-[11px] font-normal tracking-[0.2em] text-ink-500">
                  (converse e reserve)
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
        </div>
        <div className="order-1 lg:order-2">
          <ImageCarousel
            images={images}
            alt={title}
            fallbackSrc={fallbackImage}
            fit={imageFit}
            className={
              imageFrameClassName ??
              "h-[360px] w-full rounded-[28px] shadow-glow"
            }
            intervalMs={6000}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicePage;

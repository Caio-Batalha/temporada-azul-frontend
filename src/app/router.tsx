import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/AppShell";
import HomePage from "../pages/HomePage";
import WhaleWatchingPage from "../pages/WhaleWatchingPage";
import ServicePage from "../pages/ServicePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import SuccessPage from "../pages/SuccessPage";
import CancelPage from "../pages/CancelPage";
import PartiesPage from "../pages/PartiesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "avista-baleias", element: <WhaleWatchingPage /> },
      {
        path: "pescarias",
        element: (
          <ServicePage
            title="Pescarias"
            subtitle="Experiências completas de pesca no Espírito Santo, conduzidas por quem realmente entende do mar."
            images={[
              "/media/fishing-1.jpg",
              "/media/fishing-2.jpg",
              "/media/fishing-3.jpg",
            ]}
            fallbackImage="/media/fishing.svg"
            imageFit="cover"
            imageFrameClassName="aspect-[3/4] w-full rounded-[28px] shadow-glow md:aspect-[4/5]"
            content={
              <div className="space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  Nosso capitão possui mais de <strong>40 anos de experiência</strong> na região,
                  conhecendo os melhores pesqueiros e condições ideais para cada tipo de pescaria.
                </p>
                <p>
                  Realizamos desde <strong>pescarias costeiras</strong> até <strong>expedições oceânicas</strong> para as plataformas,
                  sempre com roteiros personalizados de acordo com o seu objetivo — seja lazer, esporte ou grandes capturas.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Embarcação</p>
                    <p className="mt-2 font-semibold text-ink-800">43 pés • pronta para oceânico</p>
                    <p className="mt-2 text-xs text-ink-600">
                      Camas, banheiro com chuveiro, cozinha com fogão, churrasqueira e mais.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Equipamentos</p>
                    <p className="mt-2 font-semibold text-ink-800">Penn &amp; Shimano</p>
                    <p className="mt-2 text-xs text-ink-600">
                      Material de pesca incluso nos valores, com as melhores marcas do mercado.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Grupos</p>
                    <p className="mt-2 font-semibold text-ink-800">Até 10 pessoas</p>
                    <p className="mt-2 text-xs text-ink-600">
                      Capacidade varia de acordo com o tipo de pescaria e o roteiro escolhido.
                    </p>
                  </div>
                </div>

                <p>
                  Escolha sua experiência e fale com a nossa equipe pelo WhatsApp para montar sua pescaria ideal e fazer sua reserva.
                </p>
              </div>
            }
            whatsappMessage="Olá! Tenho interesse em Pescarias com a Temporada Azul. Pode me passar detalhes e disponibilidade?"
          />
        ),
      },
      {
        path: "praias",
        element: (
          <ServicePage
            title="Tour pelas Praias"
            subtitle="Passeios exclusivos pelas praias de Vitória e Vila Velha, com total liberdade para você montar o roteiro do seu jeito."
            images={[
              "/media/beach-1.jpg",
            ]}
            fallbackImage="/media/beach.svg"
            content={
              <div className="space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  Você escolhe as praias que deseja visitar e o horário de saída —{" "}
                  <strong>entre 07:00 e 11:00</strong> — com{" "}
                  <strong>7 horas completas</strong> de experiência a partir do embarque.
                </p>
                <p>
                  Ideal para grupos, comemorações e dias especiais no mar, com conforto, privacidade
                  e atendimento personalizado do início ao fim.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Horário de saída</p>
                    <p className="mt-2 font-semibold text-ink-800">07:00 – 11:00</p>
                    <p className="mt-2 text-xs text-ink-600">Você escolhe o melhor horário.</p>
                  </div>
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Duração</p>
                    <p className="mt-2 font-semibold text-ink-800">7 horas</p>
                    <p className="mt-2 text-xs text-ink-600">A partir do embarque.</p>
                  </div>
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Capacidade</p>
                    <p className="mt-2 font-semibold text-ink-800">Até 20 pessoas</p>
                    <p className="mt-2 text-xs text-ink-600">
                      Recomendamos até <strong>15</strong> para maior conforto.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-deep-100 bg-white/75 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-deep-700">Churrasqueira</p>
                    <p className="mt-2 font-semibold text-ink-800">A bordo</p>
                    <p className="mt-2 text-xs text-ink-600">Para deixar a experiência ainda mais completa.</p>
                  </div>
                </div>

                <p>
                  Monte seu passeio ideal e fale com a nossa equipe para reservar.{" "}
                  <span aria-hidden="true">🌊</span>
                </p>
              </div>
            }
            whatsappMessage="Olá! Tenho interesse no Tour pelas Praias (Vitória/Vila Velha) com a Temporada Azul. Pode me passar detalhes e disponibilidade?"
          />
        ),
      },
      {
        path: "churrasco-a-bordo",
        element: <PartiesPage />,
      },
      { path: "sobre", element: <AboutPage /> },
      { path: "contato", element: <ContactPage /> },
      { path: "success", element: <SuccessPage /> },
      { path: "cancel", element: <CancelPage /> },
    ],
  },
]);

export default router;

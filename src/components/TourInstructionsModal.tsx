import { useEffect, useState } from "react";

type TourInstructionsModalProps = {
  buttonLabel?: string;
  buttonClassName?: string;
};

const DEFAULT_BUTTON_CLASS =
  "inline-flex items-center gap-2 rounded-full border border-deep-200 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep-700 transition hover:bg-deep-50";

const TourInstructionsModal = ({
  buttonLabel = "Mais informações",
  buttonClassName = DEFAULT_BUTTON_CLASS,
}: TourInstructionsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close with Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={buttonClassName}>
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 px-4 py-8"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-instructions-title"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl text-ink-600 transition hover:bg-ink-100"
              aria-label="Fechar"
            >
              ×
            </button>

            <p className="text-xs uppercase tracking-[0.4em] text-deep-700">
              Informações importantes
            </p>
            <h2
              id="tour-instructions-title"
              className="mt-3 font-display text-3xl text-ink-700"
            >
              Mais informações
            </h2>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-600">
              <section>
                <h3 className="font-display text-lg text-ink-700">
                  Embarque e alimentação
                </h3>
                <p className="mt-2">
                  O embarque será realizado no local e horário informados no momento da reserva.
                  Recomendamos que os clientes cheguem com antecedência para maior conforto e
                  organização da saída.
                </p>
                <p className="mt-3">
                  Cada cliente deve levar sua própria alimentação e bebidas. O barco contará com
                  isopores abastecidos com gelo para armazenamento dos itens levados pelos
                  passageiros. Você pode levar lanches prontos, sanduíches, frutas, petiscos e
                  bebidas de sua preferência. Pedimos apenas que não sejam levados alimentos que
                  necessitem do uso de fogão ou preparo durante o passeio.
                </p>
              </section>

              <section>
                <h3 className="font-display text-lg text-ink-700">O que levar</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Agasalho ou corta-vento, pois em alguns momentos pode fazer frio no mar</li>
                  <li>Protetor solar</li>
                  <li>Óculos escuros</li>
                  <li>Água para consumo pessoal</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display text-lg text-ink-700">
                  Preparação para o passeio / mal-estar
                </h3>
                <p className="mt-2">
                  Para uma experiência mais confortável no mar, recomendamos que o cliente tenha
                  uma boa noite de sono antes do passeio e evite exageros no consumo de bebidas
                  alcoólicas na noite anterior.
                </p>
                <p className="mt-3">
                  Também recomendamos que, antes de sair de casa no dia do passeio, o cliente tome
                  um medicamento para enjoo, permitindo tempo suficiente para que o efeito aconteça
                  antes da embarcação iniciar a navegação.
                </p>
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-ink-700">
                  <p>
                    <span aria-hidden="true">⚠️</span> Consulte seu médico ou farmacêutico para
                    verificar qual medicamento é mais apropriado para você e certifique-se de não
                    possuir restrições, contraindicações ou alergias. Medicamentos utilizados para
                    enjoo, como o Dramim, costumam ser recomendados para esse tipo de passeio
                    marítimo.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-display text-lg text-ink-700">Comunicação</h3>
                <p className="mt-2">
                  Após a conclusão da compra, suas informações ficarão registradas conosco. Um dia
                  antes do passeio, você receberá uma mensagem no WhatsApp confirmando a saída e
                  informando qualquer atualização adicional necessária.
                </p>
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-ink-700">
                  <p>
                    <span aria-hidden="true">⚠️</span> Pedimos atenção ao preencher o número de
                    WhatsApp do comprador, pois este será nosso principal meio de contato.
                  </p>
                </div>
              </section>

              <p className="text-ink-700">
                Nossa experiência é pensada para proporcionar conforto, segurança e um contato
                inesquecível com as baleias-jubarte no litoral capixaba{" "}
                <span aria-hidden="true">🐋</span>
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-ocean-600 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-ocean-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TourInstructionsModal;

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchAvailableTours } from "../../api/tours";
import { createHold } from "../../api/bookings";
import { createCheckoutSession } from "../../api/payments";
import PrimaryButton from "../../components/PrimaryButton";
import type { ApiError } from "../../api/client";
import { formatCurrencyBRL, formatTourDateTime } from "../../utils/format";
import { buildWhatsAppUrl } from "../../config/contact";

const formSchema = z
  .object({
    tour_id: z.number().min(1),
    ticket_count: z.number().min(1).max(10),
    buyer_full_name: z.string().min(2),
    buyer_cpf: z.string().min(11),
    buyer_whatsapp: z.string().min(8),
    terms_accepted: z
      .boolean()
      .refine((value) => value, { message: "Você precisa aceitar os Termos de Compra para continuar." }),
    passengers: z
      .array(
        z.object({
          full_name: z.string().min(2),
          cpf: z.union([z.string().min(11), z.literal(""), z.null()]).optional(),
          whatsapp: z.union([z.string().min(8), z.literal(""), z.null()]).optional(),
        }),
      )
      .min(1),
  })
  .superRefine((values, ctx) => {
    if (values.passengers.length !== values.ticket_count) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passengers"],
        message: "O número de passageiros deve ser igual ao número de ingressos.",
      });
    }

    const buyerMatches = values.passengers.filter(
      (passenger) => passenger.cpf === values.buyer_cpf,
    );
    if (buyerMatches.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passengers"],
        message:
          "O comprador deve aparecer exatamente uma vez na lista de passageiros com o mesmo CPF.",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const UNIT_PRICE_CENTS = 40000;

const WhaleWatchingForm = () => {
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours", "available"],
    queryFn: fetchAvailableTours,
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [alternativeDates, setAlternativeDates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTours = tours.length > 0;

  const defaultTourId = tours[0]?.id ?? 0;

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tour_id: defaultTourId,
      ticket_count: 1,
      buyer_full_name: "",
      buyer_cpf: "",
      buyer_whatsapp: "",
      terms_accepted: false,
      passengers: [{ full_name: "", cpf: "", whatsapp: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  const ticketCount = watch("ticket_count");
  const buyerName = watch("buyer_full_name");
  const buyerCpf = watch("buyer_cpf");
  const buyerWhatsapp = watch("buyer_whatsapp");
  const selectedTourId = watch("tour_id");
  const selectedTour = useMemo(
    () => tours.find((tour) => tour.id === selectedTourId),
    [tours, selectedTourId],
  );

  useEffect(() => {
    const current = fields.length;
    if (ticketCount > current) {
      for (let i = current; i < ticketCount; i += 1) {
        append({ full_name: "", cpf: "", whatsapp: "" });
      }
    }
    if (ticketCount < current) {
      for (let i = current; i > ticketCount; i -= 1) {
        remove(i - 1);
      }
    }
  }, [ticketCount, fields.length, append, remove]);

  useEffect(() => {
    setValue("passengers.0.full_name", buyerName);
    setValue("passengers.0.cpf", buyerCpf);
    setValue("passengers.0.whatsapp", buyerWhatsapp);
  }, [buyerName, buyerCpf, buyerWhatsapp, setValue]);

  const offerCode = useMemo(() => {
    if (ticketCount === 3 || ticketCount === 4) return "trio_deal";
    if (ticketCount >= 5) return "group_deal";
    return "standard";
  }, [ticketCount]);

  const pricing = useMemo(() => {
    const safeTicketCount = Number.isFinite(ticketCount) ? ticketCount : 0;
    const discountBps = offerCode === "trio_deal" ? 500 : offerCode === "group_deal" ? 1000 : 0;
    const grossCents = Math.max(0, safeTicketCount) * UNIT_PRICE_CENTS;
    const discountCents = Math.floor((grossCents * discountBps) / 10000);
    const totalCents = grossCents - discountCents;
    return { grossCents, discountCents, totalCents, discountBps };
  }, [ticketCount, offerCode]);

  const onSubmit = async (values: FormValues) => {
    setApiError(null);
    setAlternativeDates([]);
    setIsSubmitting(true);

    try {
      // Buyer is always Passenger 1 in the payload.
      // For the remaining passengers, CPF/WhatsApp can be omitted (kids, etc.) and are sent as null.
      const normalizedPassengers = values.passengers.map((p, idx) => {
        if (idx === 0) return p;
        const cpf = (p.cpf ?? "").toString().trim();
        const whatsapp = (p.whatsapp ?? "").toString().trim();
        return {
          ...p,
          cpf: cpf.length ? cpf : null,
          whatsapp: whatsapp.length ? whatsapp : null,
        };
      });

      // terms_accepted is frontend-only; backend contract stays unchanged.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { terms_accepted, ...payload } = values;

      const hold = await createHold({
        ...payload,
        passengers: normalizedPassengers,
        offer_code: offerCode,
      });

      const checkout = await createCheckoutSession(hold.booking_id);
      window.location.href = checkout.checkout_url;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === 409 && apiError.detail && typeof apiError.detail === "object") {
        const detail = apiError.detail as {
          message?: string;
          alternative_dates?: string[];
        };
        setApiError(detail.message ?? "Não há vagas suficientes.");
        setAlternativeDates(detail.alternative_dates ?? []);
      } else if (apiError?.detail && typeof apiError.detail === "string") {
        setApiError(apiError.detail);
      } else {
        setApiError("Não foi possível iniciar a reserva. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = () => {
    // If validation fails, keep the user oriented and show the error near the CTA.
    setApiError("Revise os campos acima para continuar.");
  };

  // Ensure a tour is selected once the list loads, but never overwrite the user's choice.
  useEffect(() => {
    const firstId = tours[0]?.id ?? 0;
    if (!firstId) return;
    const current = getValues("tour_id");
    if (!current || current <= 0) {
      setValue("tour_id", firstId, { shouldValidate: true });
    }
  }, [tours, getValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
        <h3 className="font-display text-2xl text-ink-700">Selecione a Data de sua Preferência</h3>
        {errors.tour_id && (
          <p className="mt-2 text-xs text-red-600">Selecione uma data para continuar.</p>
        )}
        <div className="mt-4 grid gap-3">
          {isLoading && <p className="text-sm text-ink-600">Carregando tours...</p>}
          {!isLoading && tours.length === 0 && (
            <p className="text-sm text-ink-600">Nenhum tour disponível no momento.</p>
          )}
          {tours.map((tour) => (
            <label
              key={tour.id}
              className="flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-ink-700">
                  {formatTourDateTime(tour.tour_date, tour.departure_time)}
                </p>
                <p className="text-xs text-ink-600">
                  {tour.boat_name} • {tour.seats_left} vagas
                </p>
              </div>
              <Controller
                name="tour_id"
                control={control}
                render={({ field }) => (
                  <input
                    type="radio"
                    value={tour.id}
                    checked={Number(field.value) === tour.id}
                    onChange={() => field.onChange(tour.id)}
                  />
                )}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
        <h3 className="font-display text-2xl text-ink-700">Dados do comprador</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">Nome</label>
            <input
              {...register("buyer_full_name")}
              className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2"
            />
            {errors.buyer_full_name && (
              <p className="mt-1 text-xs text-red-600">Informe o nome.</p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">CPF</label>
            <input
              {...register("buyer_cpf")}
              className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2"
            />
            {errors.buyer_cpf && <p className="mt-1 text-xs text-red-600">CPF obrigatório.</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">WhatsApp</label>
            <input
              {...register("buyer_whatsapp")}
              className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2"
            />
            {errors.buyer_whatsapp && (
              <p className="mt-1 text-xs text-red-600">WhatsApp obrigatório.</p>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="max-w-xs">
            <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">
              Número de ingressos
            </label>
            <input
              type="number"
              min={1}
              max={10}
              {...register("ticket_count", { valueAsNumber: true })}
              className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2"
            />
            <p className="mt-2 text-xs text-ink-600">
              Oferta aplicada:{" "}
              <strong>
                {offerCode === "standard"
                  ? "Padrão"
                  : offerCode === "trio_deal"
                  ? "Trio + (5%)"
                  : "Grupo (10%)"}
              </strong>
            </p>
          </div>

          <div className="rounded-xl border border-ocean-100 bg-ocean-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean-700">
              Total
            </p>
            <p className="mt-2 font-display text-2xl text-ink-800">
              {formatCurrencyBRL(pricing.totalCents)}
            </p>
            {pricing.discountCents > 0 ? (
              <p className="mt-2 text-xs text-ink-600">
                Você economiza <strong>{formatCurrencyBRL(pricing.discountCents)}</strong>.
              </p>
            ) : (
              <p className="mt-2 text-xs text-ink-600">
                {formatCurrencyBRL(UNIT_PRICE_CENTS)} por ingresso.
              </p>
            )}
          </div>
        </div>
      </div>

      {ticketCount > 1 && (
        <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
          <h3 className="font-display text-2xl text-ink-700">Passageiros</h3>
          <p className="mt-2 text-sm text-ink-600">
            O comprador já está incluído automaticamente como Passageiro 1. Preencha apenas os{" "}
            <strong>{ticketCount - 1}</strong> passageiro(s) adicionais.
          </p>
          {errors.passengers?.message && (
            <p className="mt-3 text-xs text-red-600">{errors.passengers.message}</p>
          )}
          <div className="mt-4 grid gap-4">
            {fields.slice(1).map((field, sliceIndex) => {
              const index = sliceIndex + 1; // real index inside passengers[]
              return (
                <div
                  key={field.id}
                  className="grid gap-4 rounded-xl border border-ocean-100 p-4 md:grid-cols-3"
                >
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">
                      Passageiro {index + 1}
                    </label>
                    <input
                      {...register(`passengers.${index}.full_name` as const)}
                      className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">CPF</label>
                    <input
                      {...register(`passengers.${index}.cpf` as const)}
                      placeholder="Opcional"
                      className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2 placeholder:text-ink-400/70"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-ocean-600">WhatsApp</label>
                    <input
                      {...register(`passengers.${index}.whatsapp` as const)}
                      placeholder="Opcional"
                      className="mt-2 w-full rounded-lg border border-ocean-100 px-3 py-2 placeholder:text-ink-400/70"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{apiError}</p>
          {alternativeDates.length > 0 && (
            <p className="mt-2">
              Datas alternativas: {alternativeDates.join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
        <details className="group">
          <summary className="cursor-pointer list-none select-none">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-xl text-ink-800">
                📄 Termos de Compra — Avistamento de Baleias
              </p>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-700">
                Ver
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-600">
              Ao prosseguir com a compra, o cliente declara estar de acordo com os termos abaixo.
            </p>
          </summary>

          <div className="mt-5 divide-y divide-deep-100/70 text-sm leading-relaxed text-ink-600">
            <section className="pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                1. Objeto do serviço
              </p>
              <p className="mt-2">
                A Temporada Azul oferece a experiência de avistamento de baleias em alto-mar, conforme data e horário
                selecionados no momento da compra.
              </p>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                2. Política de cancelamento e reembolso
              </p>
              <p className="mt-2">Em conformidade com o Código de Defesa do Consumidor:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  O cliente poderá solicitar o cancelamento com reembolso integral em até 7 (sete) dias corridos após a
                  compra, desde que feito com antecedência mínima de 48 horas do evento.
                </li>
                <li>Cancelamentos fora desse prazo poderão não ser elegíveis para reembolso.</li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                3. Condições climáticas e segurança
              </p>
              <p className="mt-2">
                A segurança no mar é prioridade absoluta para a Temporada Azul. Não hesitaremos em adiar ou remarcar um
                passeio sempre que houver qualquer risco à segurança e ao conforto de nossos clientes.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  O passeio poderá ser adiado ou remarcado com até 24 horas de antecedência, devido a condições
                  climáticas ou marítimas.
                </li>
                <li>A decisão será baseada em previsões atualizadas e critérios técnicos de segurança.</li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                4. Remarcação e reembolso por alteração
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Em caso de alteração de data por parte da Temporada Azul, o cliente poderá:</li>
                <li>Aceitar a nova data sugerida, ou</li>
                <li>Solicitar o reembolso integral do valor pago.</li>
                <li>
                  O reembolso será realizado em até 7 (sete) dias corridos, conforme o Código de Defesa do Consumidor,
                  utilizando o mesmo meio de pagamento sempre que possível.
                </li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                5. Condições da experiência e natureza da atividade
              </p>
              <p className="mt-2">
                A atividade de avistamento de baleias ocorre em ambiente natural, com animais em liberdade.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  Não é garantido o avistamento dos animais, uma vez que seu comportamento é imprevisível.
                </li>
                <li>
                  Historicamente, a Temporada Azul possui alto índice de sucesso nas saídas, tendo registrado avistamentos
                  em todas as operações realizadas até o momento, porém isso não constitui garantia.
                </li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                6. Uso de imagem e registros durante o passeio
              </p>
              <p className="mt-2">
                Durante o passeio, podem ser realizadas fotos e vídeos com foco principal no registro das baleias e da
                experiência no mar. De forma natural, a imagem dos participantes pode aparecer nesses registros.
              </p>
              <p className="mt-2">
                Ao participar, você autoriza o uso dessas imagens para divulgação da Temporada Azul, sempre de forma
                respeitosa e alinhada com a proposta da experiência.
              </p>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                7. Responsabilidades do cliente
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Comparecer no local e horário informados.</li>
                <li>Fornecer dados corretos para contato.</li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                8. Objetos pessoais
              </p>
              <p className="mt-2">
                A Temporada Azul não se responsabiliza por perdas, danos ou extravios de objetos pessoais durante o
                passeio. Recomendamos atenção aos pertences ao longo de toda a experiência.
              </p>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                9. Comparecimento (No-show)
              </p>
              <p className="mt-2">
                O não comparecimento no local e horário informados, sem aviso prévio dentro dos prazos estabelecidos,
                será considerado desistência do passeio, não sendo elegível para reembolso.
              </p>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                10. Conduta a bordo
              </p>
              <p className="mt-2">
                Para garantir a segurança de todos, os participantes devem seguir as orientações da equipe durante todo
                o passeio. O capitão é a autoridade máxima a bordo, sendo responsável pelas decisões relacionadas à
                navegação, segurança e condução da embarcação, devendo suas instruções ser respeitadas por todos.
              </p>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                11. Condições operacionais e imprevistos técnicos
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  O passeio poderá ser cancelado antes do início em caso de imprevistos técnicos, incluindo falhas
                  mecânicas, visando a segurança de todos.
                </li>
                <li>
                  Caso ocorra interrupção do passeio após o seu início por motivos técnicos, será oferecido ao cliente o
                  reembolso proporcional ou integral, conforme avaliação da situação.
                </li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                12. Condições de saúde e bem-estar
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  Condições comuns de mal-estar, como enjoo ou desconforto, não garantem o encerramento antecipado do
                  passeio.
                </li>
                <li>
                  Em casos de emergência médica, a equipe tomará as medidas necessárias, podendo incluir o retorno
                  antecipado da embarcação.
                </li>
              </ul>
            </section>

            <section className="py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                13. Uso de drones
              </p>
              <p className="mt-2">
                Por questões de segurança, é proibido o uso de drones por clientes durante o passeio.
              </p>
              <p className="mt-2">A utilização de drones será permitida apenas nas seguintes condições:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  Quando o passeio for reservado integralmente por um único grupo, mediante concordância de todos os
                  participantes e alinhamento prévio com a equipe da Temporada Azul; ou
                </li>
                <li>
                  Quando operado pela própria equipe da Temporada Azul, devidamente capacitada para operações em
                  ambiente marítimo.
                </li>
              </ul>
              <p className="mt-2">
                Essas medidas visam garantir a segurança de todos os passageiros e da operação.
              </p>
            </section>

            <section className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deep-700">
                14. Aceite
              </p>
              <p className="mt-2">
                Ao concluir a compra, o cliente declara que leu, compreendeu e concorda com os termos acima.
              </p>
            </section>
          </div>
        </details>

        <label className="mt-6 flex items-start gap-3 rounded-xl border border-deep-100 bg-deep-50/50 p-4">
          <input
            type="checkbox"
            {...register("terms_accepted")}
            className="mt-1 h-4 w-4 rounded border-deep-200 text-deep-800"
          />
          <span className="text-sm text-ink-700">
            Li e concordo com os <strong>Termos de Compra</strong>.
          </span>
        </label>
        {errors.terms_accepted && (
          <p className="mt-2 text-xs text-red-600">{errors.terms_accepted.message}</p>
        )}
      </div>

      <PrimaryButton
        type="submit"
        className="w-full bg-none bg-[#003B7A] py-4 text-base text-white shadow-[0_18px_44px_rgba(0,59,122,0.28)] hover:bg-[#00458F] disabled:bg-[#003B7A] disabled:opacity-40"
        onClick={() => setApiError(null)}
        disabled={!hasTours || isSubmitting || !watch("terms_accepted")}
      >
        {isSubmitting ? "Processando..." : "Continuar para pagamento →"}
      </PrimaryButton>
      {!watch("terms_accepted") && (
        <p className="-mt-4 text-xs text-ink-500">
          Para continuar, marque “Li e concordo com os Termos de Compra”.
        </p>
      )}

      <div className="rounded-2xl border border-ocean-100 bg-white/70 p-5 text-sm text-ink-600">
        <p className="font-semibold text-ink-700">
          Se preferir, faça sua reserva pelo WhatsApp.
        </p>
        <p className="mt-1 text-xs text-ink-500">
          Você pode enviar as informações por mensagem e nossa equipe ajuda com a confirmação.
        </p>
        <a
          href={buildWhatsAppUrl(
            `Olá! Quero reservar Avistamento de Baleias com a Temporada Azul.${
              selectedTour ? ` Data: ${formatTourDateTime(selectedTour.tour_date, selectedTour.departure_time)}.` : ""
            } Ingressos: ${ticketCount}.`,
          )}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-800 transition hover:bg-[#1ebe5d]"
        >
          WhatsApp
        </a>
      </div>
    </form>
  );
};

export default WhaleWatchingForm;

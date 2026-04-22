import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchAvailableTours } from "../../api/tours";
import { createHold } from "../../api/bookings";
import { createCheckoutSession } from "../../api/payments";
import PrimaryButton from "../../components/PrimaryButton";
import type { ApiError } from "../../api/client";
import { formatTourDateTime } from "../../utils/format";
import { buildWhatsAppUrl } from "../../config/contact";

const formSchema = z
  .object({
    tour_id: z.number().min(1),
    ticket_count: z.number().min(1).max(10),
    buyer_full_name: z.string().min(2),
    buyer_cpf: z.string().min(11),
    buyer_whatsapp: z.string().min(8),
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tour_id: defaultTourId,
      ticket_count: 1,
      buyer_full_name: "",
      buyer_cpf: "",
      buyer_whatsapp: "",
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

  useEffect(() => {
    if (defaultTourId) {
      setValue("tour_id", defaultTourId);
    }
  }, [defaultTourId, setValue]);

  const offerCode = useMemo(() => {
    if (ticketCount === 3) return "trio_deal";
    if (ticketCount >= 4) return "group_deal";
    return "standard";
  }, [ticketCount]);

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

      const hold = await createHold({
        ...values,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
        <h3 className="font-display text-2xl text-ink-700">Escolha o tour</h3>
        <p className="mt-2 text-sm text-ink-600">
          Selecione a data e o horário disponíveis.
        </p>
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
              <input
                type="radio"
                value={tour.id}
                {...register("tour_id", { valueAsNumber: true })}
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
        <div className="mt-6 max-w-xs">
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
                ? "Trio (5%)"
                : "Grupo (10%)"}
            </strong>
          </p>
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

      <PrimaryButton
        type="submit"
        className="w-full"
        onClick={() => setApiError(null)}
        disabled={!hasTours || isSubmitting}
      >
        {isSubmitting ? "Processando..." : "Ir para o pagamento"}
      </PrimaryButton>

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

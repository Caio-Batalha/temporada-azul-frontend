export const formatTourDateTime = (date: string, time: string) => {
  const iso = `${date}T${time}`;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return `${date} ${time}`;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export const formatCurrencyBRL = (amountCents: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountCents / 100);
};

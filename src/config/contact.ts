export const WHATSAPP_NUMBER_E164 = "5527998520602";
export const WHATSAPP_NUMBER_DISPLAY = "+55 (27) 99852-0602";
export const CONTACT_EMAIL = "temporadaazul@gmail.com";

export const buildWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(message)}`;
};


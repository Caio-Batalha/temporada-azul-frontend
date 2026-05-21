export const WHATSAPP_NUMBER_E164 = "5527996641703";
export const WHATSAPP_NUMBER_DISPLAY = "+55 (27) 99664-1703";
export const CONTACT_EMAIL = "temporadaazul@gmail.com";

export const buildWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(message)}`;
};


/** Número de WhatsApp da loja (formato internacional, somente dígitos). */
export const WHATSAPP_NUMBER = "5513933002750";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

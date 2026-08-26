export interface Spec {
  label: string;
  value: string;
}

/**
 * Especificações técnicas ficam na descrição do produto na Shopify,
 * no formato "Chave: valor", separadas por "|" ou por quebra de linha.
 */
export function parseSpecs(description?: string | null): Spec[] {
  if (!description) return [];

  return description
    .split(/[|\r\n]+/)
    .map((part) => part.trim())
    .filter((part) => part.includes(":"))
    .map((part) => {
      const idx = part.indexOf(":");
      return {
        label: part.slice(0, idx).trim(),
        value: part.slice(idx + 1).trim(),
      };
    })
    .filter((spec) => spec.label.length > 0 && spec.value.length > 0);
}

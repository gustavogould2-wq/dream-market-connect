export interface Spec {
  label: string;
  value: string;
}

/**
 * Especificações técnicas ficam na descrição do produto na Shopify,
 * uma por linha no formato "Chave: valor".
 */
export function parseSpecs(description?: string | null): Spec[] {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => {
      const idx = line.indexOf(":");
      return {
        label: line.slice(0, idx).trim(),
        value: line.slice(idx + 1).trim(),
      };
    })
    .filter((spec) => spec.label && spec.value);
}

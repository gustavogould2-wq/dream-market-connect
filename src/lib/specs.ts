export interface Spec {
  label: string;
  value: string;
}

const SPEC_RE =
  /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9 ºª/.\-()]{1,40}?):\s*(.+?)(?=\s+[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9 ºª/.\-()]{1,40}?:|$)/g;

/**
 * Especificações técnicas ficam na descrição do produto na Shopify,
 * no formato "Chave: valor" (uma por linha). A Storefront API pode
 * devolver tudo em uma única linha, então também separamos por padrão.
 */
export function parseSpecs(description?: string | null): Spec[] {
  if (!description) return [];
  const text = description.replace(/\s+/g, " ").trim();
  const specs: Spec[] = [];

  for (const match of text.matchAll(SPEC_RE)) {
    const label = match[1].trim();
    const value = match[2].trim();
    if (label && value) specs.push({ label, value });
  }

  return specs;
}

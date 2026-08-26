import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { SpecList } from "@/components/SpecList";
import { parseSpecs } from "@/lib/specs";
import { getProductByHandle } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify";

const productQueryOptions = (handle: string) => ({
  queryKey: ["shopify-product", handle],
  queryFn: () => getProductByHandle(handle),
});

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `Painel de LED ${params.handle} | LED Visual Santos` },
      {
        name: "description",
        content: `Especificações técnicas, preço e compra online do painel de LED ${params.handle} para comunicação visual.`,
      },
      { property: "og:title", content: `Painel de LED ${params.handle} | LED Visual Santos` },
      {
        property: "og:description",
        content: `Especificações técnicas, preço e compra online do painel de LED ${params.handle}.`,
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.handle));
    if (!product) throw notFound();
    return { product };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery<ShopifyProduct["node"] | null>(
    productQueryOptions(handle),
  );
  const addItem = useCartStore((state) => state.addItem);
  const getCheckoutUrl = useCartStore((state) => state.getCheckoutUrl);
  const isLoading = useCartStore((state) => state.isLoading);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const variants = product.variants.edges.map((edge) => edge.node);
  const selectedVariant = variants[variantIndex] ?? variants[0];
  const specs = parseSpecs(product.description);
  const image = product.images.edges[0]?.node;

  const formattedPrice = selectedVariant
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: selectedVariant.price.currencyCode,
      }).format(parseFloat(selectedVariant.price.amount))
    : null;

  const addSelected = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addSelected();
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    setIsBuying(true);
    await addSelected();
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) window.open(checkoutUrl, "_blank");
    setIsBuying(false);
  };

  const busy = isAdding || isBuying || isLoading;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Voltar para a loja
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-square rounded-2xl border border-border bg-secondary/40 overflow-hidden">
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sem imagem
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {product.title}
            </h1>
            {formattedPrice && (
              <p className="text-3xl font-bold text-primary mt-4">{formattedPrice}</p>
            )}

            {variants.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setVariantIndex(index)}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                      index === variantIndex
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Especificações técnicas
              </h2>
              {specs.length > 0 ? (
                <SpecList specs={specs} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Especificações técnicas sob consulta.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAddToCart} disabled={busy} size="lg" variant="outline">
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  "Adicionar ao carrinho"
                )}
              </Button>
              <Button onClick={handleBuyNow} disabled={busy} size="lg">
                {isBuying ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  "Comprar agora"
                )}
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Pagamento e entrega processados com segurança pela Shopify.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

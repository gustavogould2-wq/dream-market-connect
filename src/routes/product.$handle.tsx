import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/stores/cartStore";
import { useHydrated } from "@/hooks/use-hydrated";
import { getProductByHandle } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify";

const productQueryOptions = (handle: string) => ({
  queryKey: ["shopify-product", handle],
  queryFn: () => getProductByHandle(handle),
});

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Marketplace` },
      { name: "description", content: `Detalhes do produto ${params.handle}` },
      { property: "og:title", content: `${params.handle} — Marketplace` },
      { property: "og:description", content: `Detalhes do produto ${params.handle}` },
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
  const { data: product } = useSuspenseQuery<ShopifyProduct["node"] | null>(productQueryOptions(handle));
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [isAdding, setIsAdding] = useState(false);
  const hydrated = useHydrated();

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

  const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0]?.node);

  const formattedPrice = selectedVariant
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: selectedVariant.price.currencyCode,
      }).format(parseFloat(selectedVariant.price.amount))
    : null;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
    setIsAdding(false);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const currentOptions = selectedVariant?.selectedOptions.map((opt) =>
      opt.name === optionName ? { ...opt, value } : opt,
    ) ?? [{ name: optionName, value }];

    const matchingVariant = product.variants.edges.find((v) =>
      currentOptions.every((opt) =>
        v.node.selectedOptions.some((o) => o.name === opt.name && o.value === opt.value),
      ),
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  };

  const image = product.images.edges[0]?.node;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para a loja
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-secondary/20 rounded-xl overflow-hidden">
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.title}</h1>
            {formattedPrice && (
              <p className="text-2xl font-semibold text-primary mt-4">{formattedPrice}</p>
            )}
            <p className="text-muted-foreground mt-6 leading-relaxed">
              {product.description || "Sem descrição"}
            </p>

            {product.options.map((option) => (
              <div key={option.name} className="mt-6">
                <Label htmlFor={option.name}>{option.name}</Label>
                <Select
                  value={
                    selectedVariant?.selectedOptions.find((o) => o.name === option.name)?.value ?? ""
                  }
                  onValueChange={(value) => handleOptionChange(option.name, value)}
                >
                  <SelectTrigger id={option.name} className="mt-2 w-full md:w-64">
                    <SelectValue placeholder={`Selecione ${option.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isLoading || (hydrated && !selectedVariant?.availableForSale)}
              className="mt-8 w-full md:w-auto md:self-start"
              size="lg"
            >
              {isAdding || isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : hydrated && !selectedVariant?.availableForSale ? (
                "Indisponível"
              ) : (
                "Adicionar ao carrinho"
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

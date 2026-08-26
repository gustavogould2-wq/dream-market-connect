import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { PackageSearch } from "lucide-react";

const productsQueryOptions = {
  queryKey: ["shopify-products"],
  queryFn: () => getProducts(50),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketplace — Loja Shopify" },
      {
        name: "description",
        content: "Explore produtos selecionados e finalize sua compra com segurança via Shopify.",
      },
      { property: "og:title", content: "Marketplace — Loja Shopify" },
      {
        property: "og:description",
        content: "Explore produtos selecionados e finalize sua compra com segurança via Shopify.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    const products = await context.queryClient.ensureQueryData(productsQueryOptions);
    return { products };
  },
  component: IndexPage,
});

function IndexPage() {
  const { data: products } = useSuspenseQuery<ShopifyProduct[]>(productsQueryOptions);

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Nosso Marketplace
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra produtos incríveis com checkout seguro e confiável pela Shopify.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">Nenhum produto encontrado</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Sua loja Shopify ainda não tem produtos. Crie o primeiro produto me dizendo o nome,
              descrição e preço no chat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

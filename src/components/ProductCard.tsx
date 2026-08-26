import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SpecList } from "@/components/SpecList";
import { parseSpecs } from "@/lib/specs";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const specs = parseSpecs(product.node.description);

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  return (
    <Card className="overflow-hidden flex flex-col h-full border-border bg-card transition-shadow hover:shadow-[var(--led-glow)]">
      <Link to="/product/$handle" params={{ handle: product.node.handle }} className="block">
        <div className="aspect-4/3 bg-secondary/40 overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.node.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Sem imagem
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-1 p-5">
        <Link to="/product/$handle" params={{ handle: product.node.handle }}>
          <h3 className="font-display text-xl font-semibold leading-tight hover:text-primary transition-colors">
            {product.node.title}
          </h3>
        </Link>
        <p className="mt-4 text-2xl font-bold text-primary">{formattedPrice}</p>
        <div className="mt-4">
          {specs.length > 0 ? (
            <SpecList specs={specs} limit={6} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Especificações técnicas sob consulta.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full" size="lg">
          <Link to="/product/$handle" params={{ handle: product.node.handle }}>
            Comprar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [isAdding, setIsAdding] = useState(false);

  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  const handleAddToCart = async () => {
    if (!variant) return;
    setIsAdding(true);
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    setIsAdding(false);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      <Link to="/product/$handle" params={{ handle: product.node.handle }} className="block">
        <div className="aspect-square bg-secondary/20 overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.node.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sem imagem
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-1 p-4">
        <Link to="/product/$handle" params={{ handle: product.node.handle }}>
          <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
            {product.node.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.node.description || "Sem descrição"}
        </p>
        <p className="font-bold text-lg mt-3">{formattedPrice}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isLoading || !variant?.availableForSale}
          className="w-full"
        >
          {isAdding || isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : !variant?.availableForSale ? (
            "Indisponível"
          ) : (
            "Adicionar ao carrinho"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

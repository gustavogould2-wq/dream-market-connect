import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";
import { PackageSearch } from "lucide-react";
import heroImage from "@/assets/hero-led.jpg";

const productsQueryOptions = {
  queryKey: ["shopify-products"],
  queryFn: () => getProducts(50),
};

const TITLE = "Painéis de LED em Santos-SP | LED Visual";
const DESCRIPTION =
  "Painéis e letreiros de LED indoor e outdoor para empresas em Santos e Baixada Santista. Especificações técnicas completas, compra online e orçamento pelo WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
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
    <main className="bg-background">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Painel de LED em funcionamento na fachada de um edifício comercial"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative container mx-auto px-4 py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Santos · SP — Comunicação visual em LED
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-foreground">
            Comunique-se com impacto através de painéis de LED
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Mais visibilidade, imagem moderna e atração de clientes na porta da sua empresa —
            indoor e outdoor.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#produtos"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 led-glow"
            >
              Ver painéis
            </a>
            <a
              href="#orcamento"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Orçamento no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Pitch */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <p className="text-lg md:text-xl leading-relaxed text-foreground">
            Um painel de LED trabalha por você 24 horas por dia: troca de mensagem em segundos,
            chama atenção a centenas de metros e transforma sua fachada em mídia própria.
            Comércios que instalam LED relatam aumento imediato de fluxo e reconhecimento de marca —
            sem custo recorrente de impressão ou instalação de novas lonas.
            Escolha o modelo, compre online e receba com suporte técnico local em Santos.
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="tech-grid">
        <div className="container mx-auto px-4 py-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Painéis disponíveis
          </h2>
          <p className="mt-3 text-muted-foreground">
            Especificações técnicas conferidas módulo a módulo.
          </p>

          {products.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
              <PackageSearch className="h-14 w-14 text-muted-foreground mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-foreground">Nenhum produto encontrado</h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Ainda não há painéis cadastrados na loja. Peça um orçamento pelo WhatsApp abaixo.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Orçamento */}
      <section id="orcamento" className="border-t border-border bg-secondary/20">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Orçamento personalizado
          </h2>
          <p className="mt-3 mb-8 text-muted-foreground">
            Projetos sob medida, estrutura e instalação em Santos e região. Preencha e continue a
            conversa no WhatsApp.
          </p>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}

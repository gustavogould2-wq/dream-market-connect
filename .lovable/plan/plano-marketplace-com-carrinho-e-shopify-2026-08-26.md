# Plano: Marketplace com Carrinho e Shopify

## O que vamos construir
Um marketplace web com catálogo de produtos, carrinho de compras e checkout integrado à Shopify. O frontend será construído no Lovable usando React + TanStack Start, com a Shopify como motor de produtos, estoque e pagamentos.

## Etapas

1. **Habilitar Shopify (nova loja de desenvolvimento)**
   - Criar uma loja Shopify de desenvolvimento vinculada ao projeto.
   - A loja de desenvolvimento é gratuita enquanto você constrói.
   - Para mantê-la, será necessário "reivindicar" a loja em até 30 dias; a reivindicação inicia um teste gratuito de 120 dias da Shopify. Após esse período, será preciso um plano pago para vender.
   - Você pode reivindicar quando quiser, sem pressa para começar a construir.

2. **Estruturar o catálogo de produtos**
   - Listar produtos da Shopify na página inicial do marketplace.
   - Criar página de detalhe do produto com imagem, descrição, preço e variantes (tamanho, cor etc.).
   - Configurar tipografia, cores e layout usando o design system do projeto (Tailwind v4 + tokens semânticos).

3. **Implementar o carrinho**
   - Adicionar/remover itens e ajustar quantidades.
   - Persistir o carrinho no estado local (React) durante a navegação.
   - Exibir resumo de valores (subtotal) no drawer/barra lateral do carrinho.

4. **Checkout via Shopify**
   - Redirecionar o comprador para o checkout da Shopify com os itens do carrinho.
   - Usar a API da Shopify (Storefront API) para criar o checkout/cart e obter o link de pagamento.

5. **Finalização e testes**
   - Ajustar metadados de SEO (título, descrição, og:image) nas rotas.
   - Testar fluxo completo: catálogo → produto → carrinho → checkout.
   - Verificar responsividade em desktop e mobile.

## Detalhes técnicos
- **Stack:** TanStack Start v1 (React 19 + Vite 7), Tailwind CSS v4, TypeScript.
- **Backend:** server functions do TanStack para chamadas seguras à Shopify; rotas em `src/routes`.
- **Estado:** React Query para dados da Shopify; estado local para o carrinho.
- **Segurança:** credenciais da Shopify (chaves, tokens) armazenadas via secret store do Lovable, nunca no código.
- **SEO:** cada rota terá `head()` com título, descrição, og:title, og:description, og:type e twitter:card.

## Próximo passo
Após aprovação deste plano, habilitaremos a Shopify no projeto e começaremos pela estrutura do catálogo.

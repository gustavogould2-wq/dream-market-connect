# Finalizar e publicar o site

## Objetivo
Deixar o site da LED Visual Santos pronto para produção e publicar no ar.

## Passos

1. **WhatsApp de contato**
   - Substituir o placeholder `5513999999999` em `src/lib/contact.ts` pelo número real da empresa em Santos-SP.
   - O número deve estar no formato internacional (ex: `5513999999999`).

2. **Validação técnica**
   - Rodar `bun run build:dev` para garantir que não há erros de compilação após as últimas alterações.
   - Verificar logs do build e corrigir qualquer problema de tipo ou import.

3. **Teste de fluxo no preview**
   - Abrir a home no preview e confirmar que o hero, grid de produtos e formulário de orçamento renderizam corretamente.
   - Navegar para a página do produto `Painel de LED P2.5 Indoor`.
   - Testar "Adicionar ao carrinho" e confirmar que o drawer abre com o item e o badge atualiza.
   - Testar "Comprar agora" e confirmar que abre a URL de checkout da Shopify em nova aba.
   - Testar o formulário de orçamento e confirmar que gera o link correto do WhatsApp.

4. **Segurança**
   - Verificar se há um scan de segurança recente.
   - Se houver findings críticos, apresentar ao usuário antes de publicar.

5. **Publicação**
   - Executar `preview_ui--publish` para colocar o site no ar.
   - Informar a URL publicada ao usuário.

## Pergunta ao usuário
Qual o número de WhatsApp da empresa para orçamentos? (formato internacional, ex: 5513999999999)
# Criar repositório GitHub do projeto

## Objetivo
Exportar e sincronizar o código atual do projeto Lovable para um repositório GitHub, permitindo backup, versionamento e edição externa.

## Passos

1. Abrir o menu **Plus (+)** no canto inferior esquerdo do editor Lovable.
2. Selecionar **GitHub** → **Connect project**.
3. Autorizar o app Lovable no GitHub com a conta desejada.
4. Escolher a conta ou organização onde o repositório será criado.
5. Clicar em **Create Repository** no Lovable para gerar o repo com o código atual do projeto.

## Resultado esperado
- Repositório criado no GitHub com todo o código do projeto.
- Sincronização bidirecional ativada: alterações no Lovable são enviadas para o GitHub e alterações no GitHub sincronizam de volta para o Lovable.
- URL do repositório disponível para clonar, baixar ZIP ou integrar com CI/CD.

## Observações
- Essa integração é o **Git sync** do Lovable, não o conector de API do GitHub.
- Apenas uma conta GitHub pode estar conectada por vez na conta Lovable.
- O repositório será criado do zero; importação automática de repos existentes não é suportada.

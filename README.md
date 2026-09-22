# Soberania Digital — Front-end

Painel web da aplicação **Soberania Digital**, desenvolvida no Projeto Integrador II do eixo de Computação da UNIVESP (Grupo 12).

A aplicação faz a **gestão interna** de estabelecimentos alimentícios do Guarujá/SP — pedidos, cardápio e clientes — consumindo a [API Soberania Digital](https://github.com/jhowml/PI2).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · React Query · react-hook-form · Zod · Vitest

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20+**
- A **API** rodando localmente (por padrão em `http://localhost:3000`) — veja o README do back-end.

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a URL da API

```bash
cp .env.example .env.local
```

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API (padrão `http://localhost:3000`) |

### 3. Liberar o front-end no CORS da API

O front-end roda na porta **3001**. No `.env` **da API**, inclua essa origem:

```
ALLOWED_ORIGINS=http://localhost:3001
```

Reinicie a API depois de alterar o `.env`.

### 4. Subir o front-end

```bash
npm run dev
```

Acesse [http://localhost:3001](http://localhost:3001) e entre com o `APP_USERNAME` e o `APP_PASSWORD` definidos no `.env` da API.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Webpack) na porta 3001 |
| `npm run dev:turbo` | Servidor de desenvolvimento com Turbopack |
| `npm run build` | Build de produção |
| `npm start` | Executa o build na porta 3001 |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (Vitest) |

Variáveis opcionais do `next.config.ts` para o hot reload: `NEXT_DISABLE_WATCH_POLL=1` desliga o *polling* do watcher; `NEXT_WATCH_POLL_MS=250` muda o intervalo (padrão 500 ms).

## Telas

| Rota | Tela | Endpoints usados |
|------|------|------------------|
| `/login` | Login do usuário único | `POST /api/auth/login` |
| `/` | Início com atalhos | — |
| `/pedidos` | Lista de pedidos com filtro por status e **novo pedido** | `GET /api/pedidos`, `POST /api/pedidos`, `GET /api/clientes`, `GET /api/cardapio` |
| `/pedidos/[id]` | Detalhe do pedido (itens, taxa, desconto, total) | `GET /api/pedidos/:id` |
| `/clientes` | Lista e cadastro de clientes, com **endereço preenchido pelo CEP** | `GET /api/clientes`, `POST /api/clientes`, `GET /api/cep/:cep` |
| `/clientes/[id]` | Detalhe do cliente | `GET /api/clientes/:id` |
| `/cardapio` | Lista e cadastro de itens do cardápio | `GET /api/cardapio`, `POST /api/cardapio` |

### Regras refletidas na interface

- **Cliente no pedido:** a busca é feita por **telefone ou endereço** (ex.: `13 99123`, `dom pedro 350`, `enseada`); cada resultado mostra telefone, endereço e, por último, o nome. Se o cliente não existir, o botão **Cadastrar novo cliente** abre o cadastro dentro da mesma janela do pedido, com o telefone digitado já preenchido; os itens do pedido ficam guardados e, ao salvar, o cliente volta selecionado. Para entrega, um aviso aparece se o cliente não tiver endereço.
- **Novo pedido:** só itens **disponíveis** do cardápio aparecem; cada item entra uma única vez (ajuste a quantidade). Em **retirada**, a taxa de entrega fica desabilitada. O resumo mostra uma **prévia** de `itens + taxa − desconto`; o valor gravado é sempre o calculado pela API. Desconto maior que o total bloqueia o envio.
- **CEP:** ao digitar os 8 dígitos, o endereço é buscado na API e o foco vai para o número. CEP inexistente ou serviço fora do ar mostram um aviso e o endereço pode ser preenchido à mão.
- **Valores monetários** aceitam vírgula (`12,50`) e são tratados em centavos para evitar erros de arredondamento.

### Ainda não implementado (próximas quinzenas)

Edição e exclusão de pedidos, clientes e itens do cardápio; alteração de status do pedido; registro de pagamentos; dashboard de indicadores.

## Identidade visual e acessibilidade

- Paleta em **vermelho e amarelo**, definida como tokens em `src/app/globals.css` (`:root` + `@theme inline`).
- HTML semântico (`main`, `nav`, `section`, `fieldset`/`legend`, `dl`), link **"Pular para o conteúdo"** e `aria-current` no menu.
- Todo campo tem `label` associado; erros de validação são ligados ao campo (`aria-describedby`, `aria-invalid`) e anunciados (`role="alert"`).
- Modais com `role="dialog"`, título associado, fechamento por **Esc**, foco no primeiro campo e devolução do foco ao fechar.
- Status de pedido indicados por **texto**, não só por cor; foco visível em todos os elementos interativos; animações reduzidas com `prefers-reduced-motion`.

## Arquitetura

Organização **orientada a features**: rotas do Next são finas e só conectam a URL à view da feature.

```
src/
├── app/
│   ├── (auth)/login/         # Login (sem menu)
│   └── (app)/                # Páginas autenticadas (AuthGuard + AppShell)
│       ├── page.tsx          # Início
│       ├── pedidos/          # /pedidos e /pedidos/[id]
│       ├── clientes/         # /clientes e /clientes/[id]
│       └── cardapio/         # /cardapio
├── components/               # UI genérica (botão, lista, layout de listagem)
├── features/
│   ├── auth/                 # Login
│   ├── cardapio/             # types · services · schema · hooks · ui
│   ├── cep/                  # Consulta de CEP via API
│   ├── clientes/
│   ├── home/
│   └── pedidos/              # inclui totals.ts (prévia do total)
└── shared/
    ├── components/           # Shell (menu, navegação) e UI base (input, form-field, modal, paginação)
    ├── hooks/
    ├── lib/                  # api-client, auth (token), money, format
    └── types/                # Paginação
```

Cada feature segue o mesmo padrão: `types.ts` (formato da API) → `services.ts` (chamadas HTTP) → `hooks/` (React Query) → `schema.ts` (validação Zod do formulário) → `ui/` (telas).

## Transparência no uso de inteligência artificial

Parte do código e da documentação deste repositório foi elaborada com apoio de ferramentas de IA assistiva, usadas como apoio à revisão de qualidade e à comparação de soluções. Todo o conteúdo gerado deve ser validado pela equipe (revisão, lint, build, testes e critérios do negócio).

# Acessibilidade

Este documento registra o trabalho de acessibilidade feito no front-end (branch `feat/relatorio-final`), os valores medidos e o que ainda não foi implementado.

## Critérios WCAG 2.1 AA atendidos

- **1.4.3 / 1.4.6 Contraste (mínimo/aprimorado)** — todo par texto/fundo de `globals.css` mede ≥ 4.5:1 (ver tabela abaixo).
- **1.4.11 Contraste não textual** — bordas de campos de formulário, cards e do menu lateral medem ≥ 3:1.
- **1.4.4 Redimensionar texto / 1.4.10 Reflow** — nenhuma largura fixa em px nos componentes; gráficos com rolagem horizontal ficam contidos em sua própria região, sem forçar rolagem da página.
- **2.1.1 / 2.1.2 Teclado e sem armadilha de foco** — `Modal` prende Tab/Shift+Tab dentro do diálogo; `ClienteSelector` é um combobox ARIA 1.2 totalmente operável por teclado (setas, Enter, Esc).
- **2.1.4 Atalhos de caractere único** — todos os atalhos de tecla única (`N`, `/`, `G`, `?`) podem ser desativados via o modal de ajuda (`?`), com a preferência salva em `localStorage`. `Ctrl+Enter` e `Esc` (com modificador/não imprimíveis) continuam ativos mesmo desativados.
- **2.4.2 Página com título** — cada rota tem um `<title>` próprio (estático via `metadata` nas páginas de servidor; dinâmico via `useDocumentTitle` nas telas de detalhe que buscam dado no cliente).
- **2.4.3 / 2.4.7 Ordem de foco e foco visível** — `focus-visible:ring-2` consistente em todos os controles interativos; foco após submissão inválida vai para o primeiro campo com erro (ver bug corrigido abaixo).
- **4.1.2 Nome, função, valor** — `role="img"`/`role="region"` + `aria-label` em todos os gráficos do painel; `role="combobox"`/`listbox`/`option` no `ClienteSelector`.
- **4.1.3 Mensagens de status** — `role="status"`/`role="alert"` nos estados de carregamento/erro das telas principais.

## Tabela de contraste (medida, fórmula de luminância relativa do WCAG)

| Par | Razão medida | Mínimo | Resultado |
|---|---|---|---|
| foreground / background | 15.65:1 | 4.5:1 | PASSA |
| cardForeground / card | 16.26:1 | 4.5:1 | PASSA |
| mutedForeground / muted | 5.69:1 | 4.5:1 | PASSA |
| mutedForeground / background | 6.23:1 | 4.5:1 | PASSA |
| mutedForeground / card | 6.47:1 | 4.5:1 | PASSA |
| primaryForeground / primary (botão primário) | 6.23:1 | 4.5:1 | PASSA |
| primary / background (links) | 6.23:1 | 4.5:1 | PASSA |
| primary / card | 6.47:1 | 4.5:1 | PASSA |
| secondaryForeground / secondary | 10.72:1 | 4.5:1 | PASSA |
| accentForeground / accent | 10.64:1 | 4.5:1 | PASSA |
| destructiveForeground / destructive | 8.02:1 | 4.5:1 | PASSA |
| destructive / background (texto de erro) | 7.71:1 | 4.5:1 | PASSA |
| destructive / card | 8.02:1 | 4.5:1 | PASSA |
| **border / background** (contorno de cards) | **3.3:1** | 3:1 | PASSA — corrigido de 1.3:1 |
| **input / background** (contorno de campo) | **4.64:1** | 3:1 | PASSA — corrigido de 1.58:1 |
| **input / card** | **4.82:1** | 3:1 | PASSA — corrigido de 1.64:1 |
| ring / background (foco) | 6.23:1 | 3:1 | PASSA |
| ring / card | 6.47:1 | 3:1 | PASSA |
| sidebarForeground / sidebarBackground | 9.06:1 | 4.5:1 | PASSA |
| sidebarForeground 85% / sidebarBackground (itens inativos) | 6.93:1 | 4.5:1 | PASSA |
| sidebarPrimaryForeground / sidebarPrimary (item ativo) | 8.6:1 | 4.5:1 | PASSA |
| sidebarAccentForeground / sidebarAccent (hover) | 8:1 | 4.5:1 | PASSA |
| **sidebarBorder / sidebarBackground** | **4.43:1** | 3:1 | PASSA — corrigido de 1.33:1 |
| sidebarRing / sidebarBackground | 6:1 | 3:1 | PASSA |
| successForeground / success | 7.13:1 | 4.5:1 | PASSA |
| warningForeground / warning | 8.6:1 | 4.5:1 | PASSA |
| infoForeground / info | 6.7:1 | 4.5:1 | PASSA |
| status CONFIRMADO (blue-900/blue-100) | 8.5:1 | 4.5:1 | PASSA |
| status PREPARANDO (orange-900/orange-100) | 8.24:1 | 4.5:1 | PASSA |
| status ENTREGUE (green-900/green-100) | 8.24:1 | 4.5:1 | PASSA |
| status CANCELADO (stone-800/stone-200) | 12.08:1 | 4.5:1 | PASSA |

As três linhas em negrito (`--border`, `--input`, `--sidebar-border`) foram corrigidas em `src/app/globals.css` — os valores antigos (1.3:1–1.64:1) ficavam muito abaixo do mínimo de 3:1 do WCAG 1.4.11.

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `N` | Novo pedido |
| `/` | Foca a busca da página atual |
| `G` depois `I` | Ir para Início |
| `G` depois `P` | Ir para Pedidos |
| `G` depois `C` | Ir para Clientes |
| `G` depois `M` | Ir para Cardápio |
| `G` depois `D` | Ir para Indicadores |
| `?` | Abre a ajuda (lista de atalhos + toggle para desativar) |
| `Ctrl+Enter` | Salva o formulário do modal aberto |
| `Esc` | Fecha o modal aberto |

Nenhum atalho de tecla única dispara quando o foco está em `input`/`textarea`/`select`/`contenteditable`. A preferência de desativação é salva em `localStorage` (`shortcuts-disabled`).

## Bug de acessibilidade encontrado e corrigido nesta rodada

Submeter "Novo pedido" sem selecionar um cliente não movia o foco para lugar nenhum: `clienteId` é validado pelo React Hook Form através de um `input type="hidden"` (o valor real vem do `ClienteSelector`), e inputs `hidden` não são focáveis — a chamada automática de foco-em-erro do RHF (`shouldFocusError`) virava um no-op silencioso. Confirmado com um teste que reproduz exatamente esse envio; corrigido mandando o foco explicitamente para o campo de busca visível do `ClienteSelector` (`src/features/pedidos/ui/modal-pedido.tsx`).

## Testes automatizados (evidência)

- **Testes unitários/componente (Vitest + Testing Library):** 71 testes, todos passando (`npx vitest run`), incluindo:
  - Testes de comportamento (foco, teclado, ARIA) para `Modal`, `ClienteSelector`, `StatusActions`, `KeyboardShortcutsProvider`, `ModalEditarPedido`, `ModalCliente`, `ModalItemCardapio`, `ModalPedido`, `ChartCard`.
  - Testes de **zero violações de axe-core** (`vitest-axe`) para `Modal` (aberto), `ClienteSelector` (combobox aberto), `ChartCard` (gráfico e tabela), e a tela de login — todos com 0 violações medidas.

- **E2E com Playwright + `@axe-core/playwright` (`npm run test:e2e`):** 10 testes, todos passando, API mockada via `page.route` (`e2e/fixtures.ts`), autenticação simulada via `localStorage`:
  - **9 páginas** auditadas nas tags `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa` (login, início, pedidos, detalhe do pedido, clientes, detalhe do cliente, cardápio, indicadores, e o modal de novo pedido): **0 violações em todas** (`e2e/a11y.spec.ts`).
  - Durante essa varredura real em navegador foi encontrado e corrigido um **bug real**: a seção de pagamento (`PagamentoSection`) tinha um `<button>` como filho direto de um `<dl>`, violando a regra `definition-list` (WCAG 1.3.1) — os botões de ação foram movidos para fora da lista de definição (`src/features/pagamentos/ui/pagamento-section.tsx`).
  - Um fluxo completo de **"novo pedido" inteiramente por teclado** (atalho `N`, combobox por seta/Enter, navegação por Tab, `Ctrl+Enter` para salvar), sem usar o mouse (`e2e/keyboard-novo-pedido.spec.ts`).

- **Lighthouse (`npm run lighthouse`, via `playwright-lighthouse`, contra `next dev` local):**

  | Página | Performance | **Acessibilidade** | Boas práticas | SEO |
  |---|---|---|---|---|
  | Login | 66 | **100** | 100 | 91 |
  | Início | 42 | **100** | 100 | 100 |
  | Pedidos | 41 | **100** | 100 | 100 |
  | Detalhe do pedido | 41 | **100** | 100 | 100 |
  | Clientes | 40 | **100** | 100 | 100 |
  | Detalhe do cliente | 41 | **100** | 100 | 100 |
  | Cardápio | 40 | **100** | 100 | 100 |
  | Indicadores | 42 | **100** | 100 | 100 |

  Acessibilidade = **100** em todas as páginas (meta era ≥ 95). Os relatórios completos (JSON) ficam em `docs/acessibilidade/lighthouse-*.json`. **Performance é baixa porque a medição foi feita contra `next dev`** (sem minificação/otimização de produção) — não é um número comparável ao de produção; medir contra `next build && next start` fica como próximo passo.

- **CI de front-end** (`.github/workflows/ci.yml`): job `test` (lint, build, `npm test`) e job `e2e` (instala o Chromium do Playwright e roda `npm run test:e2e`).

## Não implementado (e por quê)

- Lighthouse não foi incorporado ao CI nem medido contra um build de produção (`next build && next start`) — o script (`scripts/lighthouse-audit.mjs`) roda localmente contra `next dev`; os números de performance acima não são representativos de produção.
- Verificação visual de 320px de largura e zoom a 200% foi feita por revisão de código (nenhuma largura fixa em px encontrada; todos os contêineres usam `max-w-*`/`overflow-x-auto`), não por captura de tela/teste automatizado de viewport.

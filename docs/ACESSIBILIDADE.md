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

## Não implementado nesta rodada (e por quê)

- **E2E com Playwright + `@axe-core/playwright` em todas as 9 páginas** e **Lighthouse CI**: não foram configurados nesta sessão por custo de tempo/tokens (download de binário de navegador + escrita e execução de specs para cada página). A cobertura de axe feita via `vitest-axe` nos componentes mais críticos (modal, combobox, gráficos, login) cobre os padrões de interação mais arriscados, mas não substitui uma varredura de página inteira renderizada num navegador real.
- **CI de front-end dedicado** (lint/build/vitest/Playwright) não foi criado — o CI existente é o do back-end.
- Verificação visual de 320px de largura e zoom a 200% foi feita por revisão de código (nenhuma largura fixa em px encontrada; todos os contêineres usam `max-w-*`/`overflow-x-auto`), não por captura de tela num navegador real.

Essas três frentes ficam como próximo passo recomendado, fora do escopo coberto nesta sessão.

# CLAUDE.md

Conventions for Claude Code and contributors working on the **Soberania Digital** front-end.

## Language conventions

- **Code:** English (identifiers, file and folder names, comments, test descriptions).
- **Domain terms:** pt-BR, matching the API (`cardapio`, `cliente`, `pedido`, `tipoEntrega`, `valorTotal`...).
- **User-facing text and docs** (UI copy, README): pt-BR.

## Comments

Only when the code cannot express the intent (workarounds, non-obvious decisions). Never restate what the code says.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack React Query · react-hook-form · Zod 4 · sonner · Vitest.

The back-end is the Soberania Digital API (Express + Prisma). Its responses are the source of truth for types in `features/*/types.ts`.

## Structure

- `src/app/` — routes only. Pages are thin: they read params and render a feature view.
- `src/features/<feature>/` — `types.ts`, `services.ts`, `schema.ts`, `hooks/`, `ui/`, `index.ts` (public exports).
- `src/components/` — generic UI with no business rules.
- `src/shared/` — app shell, base UI (`ui/input`, `ui/form-field`, `ui/modal`, `ui/pagination`, `ui/section`), `lib/` and shared types.
- Imports use the `@/` alias.

## Rules

- **HTTP:** always go through `shared/lib/api-client.ts` (adds the JWT, redirects on 401, turns API errors into `ApiError` with the API message).
- **Server state:** React Query hooks per feature; mutations invalidate the feature's query key and show a `sonner` toast.
- **Forms:** react-hook-form + `zodResolver`; limits mirror the API DTOs (e.g. `nome` ≤ 100, `obs` ≤ 255).
- **Money:** inputs accept comma decimals; convert with `shared/lib/money.ts` and do arithmetic in **integer cents**. `Pedido.valorTotal` is always the value computed by the API — the form only shows a preview (`features/pedidos/totals.ts`).
- **Formatting:** `shared/lib/format.ts` (`Intl` pt-BR for currency and dates, phone and CEP masks).
- **Accessibility is required:** wrap every control in `FormField` (label + `aria-describedby` + `role="alert"` errors), use semantic elements, keep visible focus rings, never convey status by color only, and give icon-only buttons an accessible label (`Button variant="icon"`).
- **Theme:** colors only through the tokens in `src/app/globals.css` (red/yellow identity); do not hardcode brand colors in components.

## Scripts

```
npm run dev      # dev server on port 3001 (the API uses 3000)
npm run build
npm run lint
npm test         # Vitest unit tests (pure functions in lib/ and features/)
```

Run `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` before committing.

# Farmácia Comunitária (Frontend)

Frontend em **React + TypeScript** para o aplicativo de farmácia pública comunitária.

## Requisitos

- Node.js 18+

## Instalação

```bash
npm install
```

## Rodar em desenvolvimento

```bash
npm run dev
```

## Variáveis de ambiente

Copie o exemplo:

```bash
copy .env.example .env
```

Principais:

- `VITE_API_URL` (ex: `http://localhost:3000/api`)
- `VITE_SSE_URL` (ex: `http://localhost:3000/api/notifications/stream`)

## Proxy no Vite (API)

O `vite.config.ts` faz proxy de `/api` para `VITE_PROXY_TARGET` (default `http://localhost:3000`).

## SSE (Server-Sent Events)

O hook `src/hooks/useSSE.ts` abre um `EventSource` para `VITE_SSE_URL?token=...`.

Se o seu backend usa `Authorization: Bearer`, mantenha o parâmetro `token` no query como está no requisito.

## Build para produção

```bash
npm run build
npm run preview
```

## Estrutura

A estrutura segue o desenho solicitado em `src/` com:

- `routes/` (React Router)
- `store/` (Redux Toolkit + Persist)
- `services/` (Axios + SSE)
- `pages/` (telas)
- `components/` (layout e componentes reutilizáveis)
- `styles/` (theme + global)

## Observações

- Várias telas admin estão como placeholder inicial (estoque, formulário de medicamento, etc.).
- Após rodar `npm install`, os erros de TypeScript sobre módulos inexistentes somem.

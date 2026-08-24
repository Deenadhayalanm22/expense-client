# Expense client

A lightweight, mobile-first SvelteKit client for viewing expense information from WhatsApp.

## Run locally

This project requires Node.js 20 or newer.

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite. The home page fetches `GET /api/summary` and displays the returned total.

## Summary API contract

```json
{
  "totalSpend": 12840,
  "currency": "INR",
  "period": "August 2026"
}
```

`src/routes/api/summary/+server.ts` currently returns demonstration data. Replace its body with a call to the authenticated Spring API when that endpoint is available; the page can remain unchanged.

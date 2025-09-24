# TEBA MVP (Transaction Enrichment & Budget Alerts)

🚀 **Goal:** A fintech-inspired MVP built with **Next.js (App Router, RSC, Server Actions, streaming)**, **Prisma + Postgres (Neon)**, and **event-driven enrichment (outbox pattern)**.  
This project ingests messy transaction data, normalizes merchants, categorizes spending, detects anomalies/recurring charges, and surfaces **budget insights with explainability**.

---

## 🔑 Features (planned)

- Upload CSV → **transactions ingestion** with idempotency
- **Event-driven enrichment** pipeline (rules + LLM fallback)
- Merchant normalization & categorization
- **Budget management** with overspend alerts
- **Insights**: unusual spikes, recurring charges
- Optimistic UI for re-categorization
- Streaming dashboard (KPIs, category breakdown, alerts)
- Explain panel with natural-language insights

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React Server Components, Tailwind, shadcn/ui
- **Backend:** Next.js Route Handlers, Server Actions, Prisma
- **Database:** Postgres (Neon)
- **AI (bounded):** LLM fallback for categorization + explain panel
- **Tooling:** ESLint, Prettier, Husky + lint-staged

---

## 📐 Architecture (WIP)

See [`/docs/architecture.md`](docs/architecture.md) for diagrams.  
_(ER diagram, event flow, and transaction lifecycle to be added.)_

---

## 🚧 Status

- [ ] Scaffold project
- [ ] DB schema & migrations
- [ ] CSV ingestion → outbox events
- [ ] Worker enrichment loop
- [ ] Dashboard KPIs + charts
- [ ] Budgets + insights
- [ ] Explain panel

---

## 📝 Demo Script (planned)

1. Upload CSV → transactions appear
2. Worker runs → enrichment + insights
3. Dashboard shows KPIs + anomalies
4. Edit a transaction category → optimistic update
5. Open Explain Panel → summary bullets + suggestion

---

## 📄 License

MIT

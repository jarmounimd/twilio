# 📱 WhatsApp Service — Project Progress

> **LinkoJob** recruitment platform microservice enabling recruiters to communicate with candidates via WhatsApp Business API.

---

## 🏗️ Architecture Overview

```
┌──────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   Frontend   │◄─────►│   NGINX Gateway  │◄─────►│ WhatsApp Service│
│  (Dashboard) │  WS   │  (auth headers)  │ HTTP  │   (this repo)   │
└──────────────┘       └──────────────────┘       └────────┬────────┘
                                                           │
                                              ┌────────────┼────────────┐
                                              ▼            ▼            ▼
                                         ┌────────┐  ┌──────────┐  ┌────────┐
                                         │MongoDB │  │ Meta API │  │Socket.io│
                                         └────────┘  └──────────┘  └────────┘
```

**Tech Stack:** Node.js · TypeScript · Express · Mongoose · Socket.io · Meta Cloud API v21.0

---

## ✅ Completed Phases

### Phase 1 — Project Setup & Cleanup

- Initialized from Linkopus Node.js template
- Configured ESLint + Prettier (no semicolons, LF endings)
- Set up environment config with `requireEnv()` for secrets

### Phase 2 — Data Models & Schemas

| Model            | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| **Client**       | Recruiter's WhatsApp Business connection (phone, token, status) |
| **Conversation** | Thread between recruiter and candidate (messages, window state) |
| **Template**     | Pre-approved WhatsApp message templates                         |

All models extend `CommonFields` (soft delete, timestamps, audit fields).

### Phase 3 — Encryption Utility

- AES-256-GCM encrypt/decrypt for Meta access tokens at rest
- **9 unit tests · 100% coverage**

### Phase 4 — Client CRUD

Full stack: DAO → Service → Controller → Routes

```
POST   /api/clients      →  Connect a new client
GET    /api/clients       →  List active clients
GET    /api/clients/me    →  Get current user's client
PUT    /api/clients/me    →  Update client info
DELETE /api/clients/me    →  Soft delete
```

### Phase 5 — OAuth Flow (Meta Embedded Signup)

```
GET  /api/auth/whatsapp/url         →  Generate OAuth consent URL
GET  /api/auth/whatsapp/callback    →  Exchange code → store encrypted token
POST /api/auth/whatsapp/disconnect  →  Revoke connection
```

Flow: OAuth code → access token → WABA ID → phone number details → encrypted storage

### Phase 6 — Webhook Handler

```
GET  /api/webhooks   →  Meta verification (challenge/response)
POST /api/webhooks   →  Receive messages & status updates (HMAC-SHA256 verified)
```

- Incoming messages → stored in conversation → 24h window opened → socket event emitted
- Status updates (sent/delivered/read/failed) → message status updated → socket event emitted

### Phase 7 — Message Sending

```
POST /api/messages/text      →  Send free-form text (requires open window)
POST /api/messages/template  →  Send template (auto-picks initiate vs re-engage)
```

**Smart template detection:**
| Scenario | Template Used |
|----------|---------------|
| No conversation exists → first contact | `initiate` template |
| Window expired → re-engagement | `reengage` template |
| Window open → redirect to text endpoint | Returns 400 |

---

## 🔄 Implemented Workflow

```
                    ┌─────────────────────────────┐
                    │   1. RECRUITER ONBOARDING    │
                    │                              │
                    │  Create client  ──► OAuth ──►│
                    │  Store encrypted access token│
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  2. INITIATE CONVERSATION    │
                    │                              │
                    │  POST /messages/template     │
                    │  → auto-pick "initiate"      │
                    │  → send via Meta API         │
                    │  → create conversation in DB │
                    │  → emit socket event         │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   3. CANDIDATE REPLIES       │
                    │                              │
                    │  Meta webhook ──► verify sig │
                    │  → store message             │
                    │  → open 24h window           │
                    │  → emit "message:incoming"   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  4. FREE-FORM MESSAGING      │
                    │       (24h window)           │
                    │                              │
                    │  POST /messages/text         │
                    │  → check window open         │
                    │  → send via Meta API         │
                    │  → emit "message:sent"       │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  5. WINDOW EXPIRES           │
                    │                              │
                    │  POST /messages/template     │
                    │  → auto-pick "reengage"      │
                    │  → restart the cycle         │
                    └─────────────────────────────┘
```

**Real-time events pushed via Socket.io:**

- `message:incoming` — candidate sent a message
- `message:sent` — recruiter's message was sent
- `message:status` — delivery status changed

---

## 🔐 Security

- **NGINX gateway** — injects `email` and `role` headers (no direct client auth needed)
- **Role guards** — all endpoints require `SYSTEM_ADMINS` or `COMPANIE_ROLES`
- **HMAC-SHA256** — webhook endpoint validates Meta's signature
- **AES-256-GCM** — access tokens encrypted at rest
- **Soft delete only** — no data is ever hard-deleted

---

---

### Phase 8 — Conversation Management

```
GET    /api/conversations                    →  Paginated conversation list
GET    /api/conversations/:id                →  Get single conversation
GET    /api/conversations/:id/messages       →  Paginated message history
PATCH  /api/conversations/:id/read           →  Mark as read (reset unread counter)
DELETE /api/conversations/:id                →  Soft delete conversation
```

- Ownership verification — users can only access their own conversations
- Live window status — `inWindow` is computed at query time, not stale DB value
- Pagination for both conversation lists and message histories

### Phase 9 — Socket.io Hardening

- **Auth middleware** (`socketAuth.ts`) — validates `email` + `role` headers on socket handshake
- **Auto-join** — sockets join a room keyed by authenticated email (no client-sent IDs)
- **Typing indicators** — `typing:start` / `typing:stop` events scoped by conversationId
- **Online presence** — tracks connected sockets per user via `isUserOnline()` utility

### Phase 10 — Tests & Documentation

**74 tests · 7 test suites · all passing**

| Test Suite             | Tests | Coverage |
| ---------------------- | ----- | -------- |
| Crypto utility         | 9     | 100%     |
| Webhook signature      | 6     | 100%     |
| Socket auth middleware | 5     | 100%     |
| Client service         | 18    | 100%     |
| Webhook service        | 11    | 98%      |
| Message service        | 11    | 98%      |
| Conversation service   | 14    | 93%      |

**Overall coverage:** 98% statements · 92% branches · 100% functions · 99% lines

**API Documentation:** OpenAPI 3.0 spec served at `/api-docs` via Swagger UI

---

## 📊 Test Coverage Summary

```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   98.01 |    92.07 |     100 |   99.29 |
 middleware/       |     100 |      100 |     100 |     100 |
 models/           |     100 |      100 |     100 |     100 |
 services/         |   97.32 |    90.47 |     100 |   99.04 |
 utils/            |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

---

## 📁 Project Structure

```
src/
├── config/          config.ts
├── controllers/     clientController · authController · webhookController
│                    messageController · conversationController
├── dao/             clientDao · conversationDao
├── middleware/       socketAuth
├── models/
│   ├── schemas/     clientSchema · conversationSchema · templateSchema
│   └── ...          client · conversation · template · webhookPayload
├── routes/          clientRoutes · authRoutes · webhookRoutes
│                    messageRoutes · conversationRoutes
├── services/
│   ├── api/         metaApi (external Meta Graph API calls)
│   └── ...          clientService · authService · webhookService
│                    messageService · conversationService
├── utils/           crypto · webhookSignature
├── validators/      clientValidator · authValidator · messageValidator
│                    conversationValidator
├── __tests__/       7 test suites (74 tests)
├── socket.ts        Socket.io init + auth + typing + presence
└── index.ts         Express + HTTP server entry point
public/
└── swagger.json     OpenAPI 3.0 spec
```

---

<p align="center"><i>WhatsApp Service — Linkopus · LinkoJob Platform</i></p>

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
| Model | Purpose |
|-------|---------|
| **Client** | Recruiter's WhatsApp Business connection (phone, token, status) |
| **Conversation** | Thread between recruiter and candidate (messages, window state) |
| **Template** | Pre-approved WhatsApp message templates |

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

## 📁 Project Structure

```
src/
├── config/          config.ts
├── controllers/     clientController · authController · webhookController · messageController
├── dao/             clientDao · conversationDao
├── models/
│   ├── schemas/     clientSchema · conversationSchema · templateSchema
│   └── ...          client · conversation · template · webhookPayload
├── routes/          clientRoutes · authRoutes · webhookRoutes · messageRoutes
├── services/
│   ├── api/         metaApi (external Meta Graph API calls)
│   └── ...          clientService · authService · webhookService · messageService
├── utils/           crypto · webhookSignature
├── validators/      clientValidator · authValidator · messageValidator
├── socket.ts        Socket.io initialization
└── index.ts         Express + HTTP server entry point
```

---

## 🚀 Next Steps

### Phase 8 — Conversation Management
> _Endpoints for the recruiter dashboard to display and interact with conversations_

- `GET /api/conversations` — paginated conversation list
- `GET /api/conversations/:id/messages` — message history with pagination
- `PATCH /api/conversations/:id/read` — mark as read
- `GET /api/conversations/:id/window` — check window status

### Phase 9 — Socket.io Hardening
> _Secure and polish real-time communication_

- Authenticate socket connections on connect
- Auto-join rooms by verified userId
- Typing indicators & online presence

### Phase 10 — Tests & Documentation
> _Production readiness_

- Unit tests for all services and DAOs
- Integration tests for controllers
- Update Swagger/OpenAPI documentation
- Final code review

---

<p align="center"><i>WhatsApp Service — Linkopus · LinkoJob Platform</i></p>

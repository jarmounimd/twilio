# LinkoJob WhatsApp Integration - Project Structure

**Status**: Ready for Development  
**Integration Type**: Embedded Signup (Client's Own Number)  
**Date**: February 2026

---

## 📁 Project Structure

```
linkojob-whatsapp/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── meta.js               # Meta API config
│   │   └── env.js                # Environment variables
│   │
│   ├── models/
│   │   ├── Client.js             # Client schema
│   │   ├── Conversation.js       # Conversation schema
│   │   └── Template.js           # Template schema
│   │
│   ├── controllers/
│   │   ├── authController.js     # OAuth & connection
│   │   ├── messageController.js  # Send/receive messages
│   │   └── webhookController.js  # Meta webhook handler
│   │
│   ├── services/
│   │   ├── metaService.js        # Meta API calls
│   │   ├── tokenService.js       # Token encryption/refresh
│   │   └── messageService.js     # Message logic
│   │
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth/*
│   │   ├── message.routes.js     # /api/messages/*
│   │   └── webhook.routes.js     # /webhook
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── encryption.js         # Token encryption
│   │   ├── logger.js             # Logging
│   │   └── validator.js          # Input validation
│   │
│   └── socket/
│       └── messageHandler.js     # Socket.io events
│
├── .env.example
├── .env
├── package.json
└── server.js                     # Entry point
```

---

## 🗄️ MongoDB Collections

### Collection 1: `clients`

Stores recruiter/company accounts with WhatsApp connection.

```javascript
{
  _id: ObjectId,
  companyName: String,              
  email: String,                    
  userId: ObjectId,                 
  
  // WhatsApp Connection
  whatsappNumber: String,           // "+212600111222"
  phoneNumberId: String,            // "1054543651068213" (Meta identifier)
  accessToken: String,              // Encrypted token
  tokenExpiry: Date,                // Token expiration
  
  // Status
  status: String,                   // "active" | "disconnected" | "suspended"
  connectedAt: Date,
  disconnectedAt: Date,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `phoneNumberId` (unique)
- `userId`
- `status`

---

### Collection 2: `conversations`

Stores all WhatsApp conversations between recruiters and candidates.

```javascript
{
  _id: ObjectId,
  clientId: ObjectId,               // ref: clients
  
  // Candidate Info
  candidatePhone: String,           // "212638167216"
  candidateName: String,            // "Ahmed Hassan" (optional)
  candidateId: ObjectId,            // ref: candidates (if exists in your system)
  
  // Messages Array
  messages: [
    {
      messageId: String,            // "wamid.xxx" (WhatsApp message ID)
      from: String,                 // "client" | "candidate"
      type: String,                 // "text" | "template" | "image" | "document"
      content: {
        text: String,               // Message text
        templateName: String,       // If type=template
        mediaUrl: String            // If type=image/document
      },
      timestamp: Date,
      status: String,               // "sent" | "delivered" | "read" | "failed"
      errorMessage: String          // If status=failed
    }
  ],
  
  // Conversation Stats
  messageCount: Number,
  lastMessageAt: Date,
  lastMessageFrom: String,          // "client" | "candidate"
  unreadCount: Number,              // Messages candidate sent but recruiter hasn't read
  
  // Window Status
  inWindow: Boolean,                // True if within 24h window (free replies)
  windowExpiresAt: Date,            // When free window closes
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `clientId` + `candidatePhone` (compound, unique)
- `clientId` + `lastMessageAt`
- `lastMessageAt` (for sorting)

---

### Collection 3: `templates`

Stores approved WhatsApp message templates.

```javascript
{
  _id: ObjectId,
  name: String,                     // "job_opportunity"
  language: String,                 // "fr" | "ar" | "en"
  category: String,                 // "MARKETING" | "UTILITY"
  
  // Template Content
  header: String,                   // Optional header text
  body: String,                     // Main message with {{1}}, {{2}} variables
  footer: String,                   // Optional footer
  
  // Variables
  variables: [
    {
      position: Number,             // 1, 2, 3...
      name: String,                 // "candidate_name", "company_name"
      description: String           // "Candidate's first name"
    }
  ],
  
  // Meta Status
  metaTemplateId: String,           // Meta's template ID
  status: String,                   // "pending" | "approved" | "rejected"
  
  // Usage Stats
  usageCount: Number,               // How many times used
  lastUsedAt: Date,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `name` + `language` (compound, unique)
- `status`

---

### Collection 4: `webhookLogs` (Optional, for debugging)

Logs all webhook events from Meta.

```javascript
{
  _id: ObjectId,
  event: Object,                    // Full webhook payload
  phoneNumberId: String,
  eventType: String,                // "message" | "status" | "error"
  processed: Boolean,
  processingError: String,
  createdAt: Date
}
```

**Indexes**:
- `phoneNumberId`
- `createdAt` (TTL: auto-delete after 30 days)

---

## 🔌 API Endpoints

### Authentication & Connection

```
POST   /api/auth/whatsapp/initiate
       → Generate OAuth URL for client to connect WhatsApp

GET    /api/auth/whatsapp/callback?code=xxx
       → Handle OAuth callback, exchange code for token

DELETE /api/auth/whatsapp/disconnect
       → Disconnect client's WhatsApp
```

### Messaging

```
POST   /api/messages/send
       Body: { clientId, candidatePhone, message, templateName }
       → Send message to candidate

GET    /api/messages/conversations?clientId=xxx
       → Get all conversations for a client

GET    /api/messages/conversation/:conversationId
       → Get full conversation history

PATCH  /api/messages/conversation/:conversationId/read
       → Mark conversation as read
```

### Webhook

```
GET    /webhook?hub.mode=subscribe&hub.verify_token=xxx&hub.challenge=xxx
       → Webhook verification by Meta

POST   /webhook
       → Receive incoming messages and status updates from Meta
```

### Templates

```
GET    /api/templates
       → List all approved templates

POST   /api/templates
       → Create new template (submit to Meta for approval)
```

---

## 🔐 Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3000
BASE_URL=https://api.linkojob.com

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/linkojob

# Meta App Credentials
META_APP_ID=1539203751104689
META_APP_SECRET=your_app_secret
META_WEBHOOK_VERIFY_TOKEN=random_secure_token

# Encryption
TOKEN_ENCRYPTION_KEY=32_byte_random_key
JWT_SECRET=your_jwt_secret

# Socket.io
SOCKET_URL=https://linkojob.com

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379
```

---

## 🔄 Key Workflows

### Workflow 1: Client Connects WhatsApp

```
1. Recruiter clicks "Connect WhatsApp" button
   ↓
2. Frontend calls: POST /api/auth/whatsapp/initiate
   ↓
3. Backend generates OAuth URL
   ↓
4. Recruiter authorizes on Facebook
   ↓
5. Meta redirects to: GET /api/auth/whatsapp/callback?code=xxx
   ↓
6. Backend exchanges code for access_token
   ↓
7. Store in clients collection:
   - phoneNumberId
   - accessToken (encrypted)
   - whatsappNumber
   ↓
8. Return success to frontend
```

### Workflow 2: Send Message

```
1. Recruiter types message in chat UI
   ↓
2. Frontend calls: POST /api/messages/send
   ↓
3. Backend:
   - Find client in DB (get phoneNumberId, accessToken)
   - Check if conversation exists
   - Check if in 24h window
   - If not in window → Use template
   - If in window → Send text
   ↓
4. Call Meta API:
   POST https://graph.facebook.com/v21.0/{phoneNumberId}/messages
   Authorization: Bearer {decrypted accessToken}
   ↓
5. Save message in conversations.messages[]
   ↓
6. Emit Socket.io event to frontend
   ↓
7. Return success
```

### Workflow 3: Receive Message

```
1. Candidate replies via WhatsApp
   ↓
2. Meta sends: POST /webhook
   {
     metadata: { phone_number_id: "xxx" },
     messages: [{ from: "212638167216", text: { body: "..." } }]
   }
   ↓
3. Backend:
   - Extract phoneNumberId → Find client
   - Extract from → Find/create conversation
   - Save message in conversations.messages[]
   - Update: inWindow=true, windowExpiresAt=now+24h
   - Increment unreadCount
   ↓
4. Emit Socket.io event to recruiter's dashboard
   ↓
5. Return 200 OK to Meta
```

---

## 🔒 Security Checklist

- [ ] Encrypt access tokens before storing in DB
- [ ] Validate webhook signatures from Meta
- [ ] Use HTTPS for all endpoints
- [ ] Rate limiting on API endpoints
- [ ] Input validation & sanitization
- [ ] JWT authentication for API calls
- [ ] Environment variables never committed to git
- [ ] Token refresh logic (handle expiration)
- [ ] Error logging (but never log tokens/secrets)

---

## 📦 Required Packages

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "axios": "^1.6.2",
    "socket.io": "^4.6.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "crypto": "built-in",
    "joi": "^17.11.0",
    "winston": "^3.11.0"
  }
}
```

---

## 📊 Database Indexes Summary

**Critical for Performance**:

```javascript
// clients
db.clients.createIndex({ phoneNumberId: 1 }, { unique: true });
db.clients.createIndex({ userId: 1 });

// conversations
db.conversations.createIndex({ clientId: 1, candidatePhone: 1 }, { unique: true });
db.conversations.createIndex({ clientId: 1, lastMessageAt: -1 });
db.conversations.createIndex({ lastMessageAt: -1 });

// templates
db.templates.createIndex({ name: 1, language: 1 }, { unique: true });

// webhookLogs (optional)
db.webhookLogs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL
```

---

## ✅ Implementation Priority

**Phase 1** (Week 1):
1. Setup project structure
2. MongoDB schemas & models
3. OAuth flow (auth routes)
4. Basic webhook handler

**Phase 2** (Week 2):
1. Message sending logic
2. Message receiving & storage
3. Socket.io integration
4. Token encryption/refresh

**Phase 3** (Week 3):
1. Template management
2. Error handling
3. Security hardening
4. Testing

**Phase 4** (Week 4):
1. Deployment
2. Monitoring
3. Documentation

---

**Ready for your firm's Node template integration!** 🚀

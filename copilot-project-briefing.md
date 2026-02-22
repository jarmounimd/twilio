# COPILOT BRIEFING: WhatsApp Business Integration for LinkoJob Recruitment Platform

## PROJECT CONTEXT

I'm building a WhatsApp Business microservice for LinkoJob, a recruitment platform in Morocco. We help recruiters communicate with job candidates via WhatsApp using Meta's WhatsApp Business Cloud API.

**Key Business Model:**
- Recruiters (clients) connect their own WhatsApp Business numbers to our platform via OAuth (Embedded Signup)
- Each recruiter manages conversations with their candidates through our dashboard
- Candidates apply on our website, we send them WhatsApp messages from the recruiter's business number
- Multi-tenant architecture: one platform, multiple clients, each with their own WhatsApp number

**Current State:**
- ✅ POC validated (OAuth flow works, messages sent/received successfully)
- ✅ Meta Business account created, waiting for verification approval
- ✅ Microservice scaffolded using firm's Node.js template
- 🔄 Need to implement production features now

---

## TECHNICAL STACK

**Backend:**
- Node.js v20+ LTS
- Express.js v4.x
- MongoDB with Mongoose
- Socket.io v4.x (real-time updates)
- Axios (Meta API calls)
- JWT authentication
- Crypto (token encryption)

**External APIs:**
- Meta WhatsApp Business Cloud API v21.0+
- Webhook-based message receiving

**Infrastructure:**
- Production domain with SSL (HTTPS required for webhooks)
- MongoDB Atlas or similar
- Optional: Redis for caching

---

## META WHATSAPP CLOUD API INTEGRATION

### Authentication Flow (Embedded Signup/OAuth)

1. **Recruiter Initiation:**
   - Recruiter clicks "Connect WhatsApp" in dashboard
   - Backend generates OAuth URL:
     ```
     https://www.facebook.com/v21.0/dialog/oauth?
       client_id={META_APP_ID}
       &redirect_uri={OUR_CALLBACK_URL}
       &response_type=code
       &scope=whatsapp_business_management,whatsapp_business_messaging
     ```

2. **OAuth Callback:**
   - Facebook redirects to our `/api/auth/whatsapp/callback?code=xxx`
   - Exchange code for access token:
     ```javascript
     GET https://graph.facebook.com/v21.0/oauth/access_token
     params: { client_id, client_secret, redirect_uri, code }
     ```
   - Response contains access_token (use to send messages on recruiter's behalf)

3. **Get Phone Number ID:**
   - Each WhatsApp Business number has a unique phone_number_id
   - Store this with client data (needed for all API calls)

4. **Store Client:**
   ```javascript
   {
     clientId: recruiter_user_id,
     phoneNumberId: "1054543651068213",
     accessToken: encrypt(token),
     whatsappNumber: "+212600111222",
     status: "active"
   }
   ```

### Sending Messages

**API Endpoint:**
```javascript
POST https://graph.facebook.com/v21.0/{phone_number_id}/messages
Authorization: Bearer {client.accessToken}
Content-Type: application/json

Body:
{
  messaging_product: "whatsapp",
  to: "212638167216",
  type: "text" | "template",
  
  // For text (within 24h window):
  text: { body: "Message content" },
  
  // For template (first message or after 24h):
  template: {
    name: "application_received",
    language: { code: "fr" },
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: "Ahmed" },
        { type: "text", text: "Developer PHP" }
      ]
    }]
  }
}
```

**Critical Rules:**
- ❌ First message to candidate = MUST use template (costs 0.40 MAD)
- ✅ After candidate replies = 24h free window opens
- ✅ Within 24h window = Free text messages
- ⏰ After 24h silence = Must use template again

### Receiving Messages (Webhooks)

**Meta sends POST to our webhook:**
```javascript
POST /webhook
{
  entry: [{
    changes: [{
      value: {
        metadata: {
          phone_number_id: "1054543651068213"  // Which client
        },
        messages: [{
          from: "212638167216",  // Which candidate
          id: "wamid.xxx",
          timestamp: "1734567890",
          text: {
            body: "Message content"
          }
        }]
      }
    }]
  }]
}
```

**Routing Logic:**
1. Extract `phone_number_id` → Find which client (recruiter)
2. Extract `from` → Find which candidate
3. Find/create conversation: `{ clientId, candidatePhone }`
4. Save message to database
5. Update 24h window: `windowExpiresAt = now + 24h`
6. Emit Socket.io event to recruiter's dashboard
7. Respond 200 OK to Meta

**Webhook Verification (GET):**
```javascript
GET /webhook?hub.mode=subscribe&hub.verify_token=xxx&hub.challenge=yyy

Response: hub.challenge (if verify_token matches)
```

---

## MONGODB COLLECTIONS SCHEMA

### Collection: `clients`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to existing user in main platform
  companyName: String,           // "Acme Corp"
  email: String,
  
  // WhatsApp Connection
  phoneNumberId: String,         // "1054543651068213" (unique, indexed)
  whatsappNumber: String,        // "+212600111222"
  accessToken: String,           // Encrypted with crypto
  tokenExpiry: Date,
  
  // Status
  status: String,                // "active" | "disconnected"
  connectedAt: Date,
  disconnectedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.clients.createIndex({ phoneNumberId: 1 }, { unique: true })
db.clients.createIndex({ userId: 1 })
db.clients.createIndex({ status: 1 })
```

### Collection: `conversations`

```javascript
{
  _id: ObjectId,
  clientId: ObjectId,            // ref: clients
  
  // Candidate
  candidatePhone: String,        // "212638167216"
  candidateName: String,
  candidateId: ObjectId,         // Optional: ref to candidates collection
  applicationId: ObjectId,       // Optional: ref to job application
  
  // Messages Array
  messages: [
    {
      messageId: String,         // "wamid.xxx" (WhatsApp message ID)
      from: String,              // "client" | "candidate"
      type: String,              // "text" | "template" | "image"
      content: {
        text: String,
        templateName: String,    // If type=template
        mediaUrl: String
      },
      timestamp: Date,
      status: String,            // "sent" | "delivered" | "read" | "failed"
      errorMessage: String
    }
  ],
  
  // Stats
  messageCount: Number,
  lastMessageAt: Date,
  lastMessageFrom: String,       // "client" | "candidate"
  unreadCount: Number,           // For recruiter dashboard
  
  // 24h Window Tracking
  inWindow: Boolean,             // Are we in free messaging window?
  windowExpiresAt: Date,         // When does it expire?
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.conversations.createIndex({ clientId: 1, candidatePhone: 1 }, { unique: true })
db.conversations.createIndex({ clientId: 1, lastMessageAt: -1 })
db.conversations.createIndex({ lastMessageAt: -1 })
```

### Collection: `templates` (Optional)

```javascript
{
  _id: ObjectId,
  name: String,                  // "application_received"
  language: String,              // "fr" | "ar" | "en"
  category: String,              // "MARKETING" | "UTILITY"
  
  body: String,                  // "Bonjour {{1}}, merci pour votre candidature..."
  variables: [
    { position: 1, name: "candidate_name", description: "Candidate first name" },
    { position: 2, name: "job_title", description: "Job position" }
  ],
  
  metaTemplateId: String,        // Meta's approved template ID
  status: String,                // "pending" | "approved" | "rejected"
  
  usageCount: Number,
  lastUsedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.templates.createIndex({ name: 1, language: 1 }, { unique: true })
db.templates.createIndex({ status: 1 })
```

---

## KEY WORKFLOWS

### Workflow 1: Recruiter Connects WhatsApp

```
1. Frontend: User clicks "Connect WhatsApp"
   POST /api/auth/whatsapp/initiate
   ↓
2. Backend: Generate OAuth URL
   Return: { oauthUrl: "https://facebook.com/v21.0/dialog/oauth?..." }
   ↓
3. Frontend: Open popup/redirect to OAuth URL
   ↓
4. User authorizes on Facebook
   ↓
5. Facebook redirects: GET /api/auth/whatsapp/callback?code=ABC123
   ↓
6. Backend:
   - Exchange code for access_token
   - Get phone_number_id from token debug
   - Encrypt access_token
   - Save to clients collection
   ↓
7. Return success to frontend
   { success: true, client: { phoneNumberId, whatsappNumber } }
```

### Workflow 2: Send Message to Candidate

```
1. Candidate applies on website (has phone number)
   ↓
2. System triggers: POST /api/messages/send
   Body: {
     clientId: "recruiter_id",
     candidatePhone: "212638167216",
     candidateName: "Ahmed Hassan",
     jobTitle: "Developer PHP",
     companyName: "Acme Corp"
   }
   ↓
3. Backend logic:
   - Get client from DB (phoneNumberId, decrypt accessToken)
   - Check if conversation exists
   - Check if in 24h window (inWindow, windowExpiresAt)
   
   If NOT in window OR first message:
     → Use template "application_received"
     → Cost: 0.40 MAD
   
   If in window:
     → Send plain text
     → Cost: FREE
   ↓
4. Call Meta API:
   POST https://graph.facebook.com/v21.0/{phoneNumberId}/messages
   Authorization: Bearer {accessToken}
   Body: { messaging_product: "whatsapp", to: "212638167216", ... }
   ↓
5. Save message to conversations.messages[]
   ↓
6. Emit Socket.io event: "message:sent"
   ↓
7. Return success
```

### Workflow 3: Receive Message from Candidate

```
1. Candidate replies on WhatsApp
   ↓
2. Meta sends: POST /webhook
   {
     metadata: { phone_number_id: "1054543651068213" },
     messages: [{ from: "212638167216", text: { body: "Yes interested" } }]
   }
   ↓
3. Backend:
   - Extract phone_number_id → Find client in DB
   - Extract from → Find conversation or create new
   - Save message to conversations.messages[]
   - Update conversation:
     * inWindow = true
     * windowExpiresAt = now + 24 hours
     * unreadCount++
     * lastMessageAt = now
     * lastMessageFrom = "candidate"
   ↓
4. Emit Socket.io event to recruiter's dashboard:
   socket.to(clientId).emit("message:received", { conversationId, message })
   ↓
5. Respond 200 OK to Meta (MUST respond quickly)
```

---

## API ENDPOINTS TO IMPLEMENT

### Authentication Routes (`/api/auth/whatsapp/*`)

```javascript
POST   /api/auth/whatsapp/initiate
       → Generate OAuth URL for client connection
       Auth: Required (JWT)
       Response: { oauthUrl: string }

GET    /api/auth/whatsapp/callback
       → Handle OAuth callback, exchange code for token
       Query: code, state
       Response: Redirect to dashboard with success/error

DELETE /api/auth/whatsapp/disconnect
       → Disconnect client's WhatsApp
       Auth: Required
       Response: { success: boolean }
```

### Message Routes (`/api/messages/*`)

```javascript
POST   /api/messages/send
       → Send message to candidate
       Auth: Required
       Body: { clientId, candidatePhone, message?, templateName?, templateVars? }
       Response: { success, messageId, cost }

GET    /api/messages/conversations
       → Get all conversations for a client
       Auth: Required
       Query: clientId, page, limit
       Response: { conversations: [], total, hasMore }

GET    /api/messages/conversation/:conversationId
       → Get full conversation history
       Auth: Required
       Response: { conversation, messages: [] }

PATCH  /api/messages/conversation/:conversationId/read
       → Mark conversation as read (reset unreadCount)
       Auth: Required
       Response: { success }
```

### Webhook Routes (`/webhook`)

```javascript
GET    /webhook
       → Webhook verification by Meta
       Query: hub.mode, hub.verify_token, hub.challenge
       Response: hub.challenge (or 403)

POST   /webhook
       → Receive messages and status updates from Meta
       Auth: None (public, but verify signature)
       Body: Meta webhook payload
       Response: 200 OK (always, even on error)
```

---

## ENVIRONMENT VARIABLES

```bash
# Server
NODE_ENV=production
PORT=3000
BASE_URL=https://api.linkojob.com

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/linkojob

# Meta App
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_WEBHOOK_VERIFY_TOKEN=random_secure_token
META_API_VERSION=v21.0

# Security
TOKEN_ENCRYPTION_KEY=32_byte_random_hex_key
JWT_SECRET=your_jwt_secret

# Socket.io
SOCKET_URL=https://linkojob.com
CORS_ORIGIN=https://linkojob.com

# Optional
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

---

## SECURITY REQUIREMENTS

1. **Token Encryption:**
   ```javascript
   const crypto = require('crypto');
   const algorithm = 'aes-256-gcm';
   const key = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY, 'hex');
   
   function encrypt(text) {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(algorithm, key, iv);
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     const authTag = cipher.getAuthTag();
     return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
   }
   
   function decrypt(encrypted) {
     const parts = encrypted.split(':');
     const iv = Buffer.from(parts[0], 'hex');
     const authTag = Buffer.from(parts[1], 'hex');
     const decipher = crypto.createDecipheriv(algorithm, key, iv);
     decipher.setAuthTag(authTag);
     let decrypted = decipher.update(parts[2], 'hex', 'utf8');
     decrypted += decipher.final('utf8');
     return decrypted;
   }
   ```

2. **Webhook Signature Verification:**
   ```javascript
   function verifyWebhookSignature(payload, signature) {
     const hmac = crypto.createHmac('sha256', process.env.META_APP_SECRET);
     const digest = hmac.update(payload).digest('hex');
     return crypto.timingSafeEqual(
       Buffer.from(signature),
       Buffer.from(digest)
     );
   }
   ```

3. **JWT Authentication:** All API routes require valid JWT except webhook
4. **Input Validation:** Use Joi or similar for all inputs
5. **Rate Limiting:** Prevent abuse on public endpoints

---

## SOCKET.IO EVENTS

### Server Emits:

```javascript
// New message received from candidate
socket.to(clientId).emit('message:received', {
  conversationId,
  message: { from, text, timestamp }
});

// Message sent successfully
socket.to(clientId).emit('message:sent', {
  conversationId,
  messageId,
  status: 'sent'
});

// Message delivery status update
socket.to(clientId).emit('message:status', {
  messageId,
  status: 'delivered' | 'read' | 'failed'
});

// Conversation updated
socket.to(clientId).emit('conversation:updated', {
  conversationId,
  updates: { unreadCount, lastMessageAt }
});
```

### Client Listens:

```javascript
socket.on('message:received', handleNewMessage);
socket.on('message:sent', updateMessageStatus);
socket.on('message:status', updateDeliveryStatus);
socket.on('conversation:updated', refreshConversation);
```

---

## ERROR HANDLING

### Common Meta API Errors:

```javascript
// Error 133010: Account not registered
// → User's phone number not added to Meta app
// → In production: Phone number not verified

// Error 131026: Message undeliverable
// → Candidate blocked the number
// → Or phone number invalid

// Error 100: Invalid parameter
// → Check request format

// Handle gracefully:
try {
  await sendMessage();
} catch (error) {
  if (error.response?.data?.error?.code === 133010) {
    // Log and notify admin
    // Mark conversation as failed
  }
  // Save error to message.errorMessage
  // Don't crash the service
}
```

---

## TESTING CHECKLIST

- [ ] OAuth flow connects and stores token correctly
- [ ] Encrypted tokens can be decrypted
- [ ] Webhook verification works
- [ ] Messages received and saved to DB
- [ ] Socket.io events emitted correctly
- [ ] 24h window logic works (template vs text)
- [ ] Template messages send successfully
- [ ] Text messages send within window
- [ ] Conversation creation and updates
- [ ] Multiple clients isolated correctly (multi-tenant)
- [ ] Error handling for failed sends
- [ ] Webhook signature verification

---

## WHAT I NEED HELP WITH

I have the microservice scaffolded with my firm's Node.js template. I need you to help me:

1. **Implement the OAuth controller** for Embedded Signup flow
2. **Build the webhook handler** to receive and process messages
3. **Create message sending service** with template vs text logic
4. **Implement 24h window tracking** in conversations
5. **Set up Socket.io** for real-time updates
6. **Token encryption/decryption** utilities
7. **Error handling** for Meta API errors
8. **Input validation** with proper schemas

Please help me write clean, production-ready code following best practices for Node.js microservices. Ask me questions if you need clarification on any part of the architecture or requirements.

---

**Current Status:**
- ✅ Meta Business account created (waiting approval)
- ✅ POC completed (OAuth works, messages sent/received)
- ✅ Microservice project structure ready
- 🔄 Ready to implement production features

Let's build this! 🚀

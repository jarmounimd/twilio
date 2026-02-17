# WhatsApp Embedded Signup POC - Team Presentation

**Date**: February 17, 2026  
**Project**: LinkoJob WhatsApp Integration  
**Integration Type**: Case 1 - Embedded Signup (Client's Own Number)

---

## 🎯 What We Accomplished

Successfully tested the **WhatsApp Business Embedded Signup flow** where clients connect their own WhatsApp Business numbers to our platform and we manage messaging on their behalf.

### ✅ POC Results

- ✅ OAuth flow works perfectly
- ✅ Access token exchange successful
- ✅ Webhook verification configured
- ✅ Template messages sent successfully
- ✅ Messages sent from client's WhatsApp Business number
- ✅ Multi-tenant architecture validated (each client uses their own token)

---

## 📋 POC Technical Setup

### Step 1: Meta App Configuration

**Meta for Developers**: https://developers.facebook.com/apps

1. Created app: **LinkoPOC** (App ID: `1539203751104689`)
2. Added **WhatsApp** product
3. Configured webhook:
   - URL: `https://multifactorial-patria-peakily.ngrok-free.dev/webhook`
   - Verify Token: `linkojob_webhook_2026`
   - Subscribed to: `messages` field

### Step 2: Project Structure

```
whatsapp-poc/
├── server.js         # Main server with 5 endpoints
├── package.json      # Dependencies (express, dotenv, axios)
├── .env              # Credentials (META_APP_ID, META_APP_SECRET)
├── .gitignore        # Protect credentials
└── README.md         # Documentation
```

**Dependencies**:

- Express (server)
- Axios (API calls)
- Dotenv (environment variables)
- ngrok (local tunnel for webhooks)

### Step 3: Server Endpoints

| Endpoint           | Method | Purpose                                  |
| ------------------ | ------ | ---------------------------------------- |
| `/webhook`         | GET    | Webhook verification by Meta             |
| `/webhook`         | POST   | Receive incoming messages                |
| `/embedded-signup` | GET    | OAuth callback (exchange code for token) |
| `/test-send`       | GET    | Send test message                        |
| `/clients`         | GET    | List connected clients                   |

### Step 4: OAuth Flow

**OAuth URL Format**:

```
https://www.facebook.com/v21.0/dialog/oauth?
  client_id=1539203751104689
  &redirect_uri=https://multifactorial-patria-peakily.ngrok-free.dev/embedded-signup
  &response_type=code
  &scope=whatsapp_business_management,whatsapp_business_messaging
```

**Flow**:

1. User clicks OAuth URL → Facebook login
2. User authorizes WhatsApp Business account
3. Facebook redirects to our `/embedded-signup` endpoint with code
4. Server exchanges code for access token
5. Token stored with client data

### Step 5: Sending Messages

**Template Message** (first contact):

```
http://localhost:3000/test-send?
  clientId=client_1771264543772
  &to=212638167216
  &template=true
```

**Regular Text** (within 24h window after user replies):

```
http://localhost:3000/test-send?
  clientId=client_1771264543772
  &to=212638167216
  &message=Hello%20from%20LinkoJob
```

### Step 6: Receiving Messages

When user replies via WhatsApp:

- Meta sends webhook POST to `/webhook`
- **We extract TWO key identifiers**:
  - `phone_number_id`: Which recruiter/client (e.g., "1054543651068213" = Acme Corp)
  - `from`: Which candidate sent the message (e.g., "212638167216" = Ahmed)
- Find conversation: `{ clientId: "acme", candidatePhone: "212638167216" }`
- Store message in database
- Emit to recruiter's dashboard via Socket.io

**Example Webhook Payload**:

```json
{
  "metadata": {
    "phone_number_id": "1054543651068213"
  },
  "messages": [
    {
      "from": "212638167216",
      "id": "wamid.xxx",
      "text": {
        "body": "Yes, I'm interested in this job"
      }
    }
  ]
}
```

**How we route it**:

1. `phone_number_id` → Find client: "Acme Corp"
2. `from` → Find candidate: "Ahmed (212638167216)"
3. Store in: `conversations.find({ clientId: "acme", candidatePhone: "212638167216" })`
4. Notify: Emit Socket.io event to Acme Corp's dashboard

---

## 🔑 Key Concepts Validated

### 1. Multi-Tenant Architecture

Each client has their own:

- ✅ WhatsApp Business number
- ✅ `phone_number_id` (unique identifier)
- ✅ `access_token` (permission to send on their behalf)

**Example**:

```javascript
// Client 1: Acme Corp
{
  clientId: "client_acme",
  whatsappNumber: "+212 600 111 222",
  phoneNumberId: "1054543651068213",
  accessToken: "EAA...xyz"
}

// Client 2: TechRecruit
{
  clientId: "client_tech",
  whatsappNumber: "+212 600 333 444",
  phoneNumberId: "9999888777666555",
  accessToken: "EAA...abc"
}
```

### 2. Message Routing

**Sending**: Use client's `phone_number_id` and `access_token`

```javascript
POST https://graph.facebook.com/v21.0/{phone_number_id}/messages
Authorization: Bearer {client.accessToken}
```

**Receiving**: Webhook contains BOTH identifiers

```javascript
// Webhook payload
{
  metadata: {
    phone_number_id: "1054543651068213"  // Which recruiter (client)
  },
  messages: [{
    from: "212638167216",                // Which candidate sent
    text: { body: "Message content" }
  }]
}

// Your routing logic
phone_number_id → Identifies client (Acme Corp)
from            → Identifies candidate (Ahmed)
```

**Example Flow**:

Recruiter "Acme Corp" (phone_number_id: `1054543651068213`) has 3 conversations:

- Candidate Ahmed (`212638167216`)
- Candidate Sara (`212677889900`)
- Candidate Youssef (`212666555444`)

When Ahmed replies:

```javascript
{
  phone_number_id: "1054543651068213",  // Route to Acme Corp
  from: "212638167216"                  // Ahmed's conversation
}
```

When Sara replies:

```javascript
{
  phone_number_id: "1054543651068213",  // Same recruiter (Acme Corp)
  from: "212677889900"                  // Sara's conversation
}
```

### 3. Message Types

| Type     | When                                     | Cost     |
| -------- | ---------------------------------------- | -------- |
| Template | First message / After 24h window expires | 0.40 MAD |
| Text     | Within 24h after user replies            | FREE     |

---

## 🚀 Production Implementation Plan

### Phase 1: Database & Backend (Week 1)

**MongoDB Collections**:

```javascript
// clients
{
  _id: ObjectId,
  companyName: "Acme Corp",
  email: "contact@acme.com",
  whatsappNumber: "+212 600 111 222",
  phoneNumberId: "1054543651068213",
  accessToken: "encrypted_token_here",
  connectedAt: ISODate("2026-02-17"),
  status: "active"
}

// conversations
{
  _id: ObjectId,
  clientId: ObjectId, // ref to clients
  candidatePhone: "212638167216",
  candidateName: "Ahmed Hassan",
  messages: [
    {
      from: "client", // or "candidate"
      text: "Hello Ahmed, we have a job for you",
      timestamp: ISODate("2026-02-17T10:00:00Z"),
      messageId: "wamid.xxx",
      status: "delivered"
    }
  ],
  lastMessageAt: ISODate("2026-02-17T10:00:00Z"),
  unreadCount: 0
}

// templates (approved message templates)
{
  _id: ObjectId,
  name: "job_opportunity",
  language: "fr",
  content: "Bonjour {{1}}, nous avons une opportunité...",
  status: "approved"
}
```

**Backend API Routes**:

```javascript
// Authentication & Connection
POST   /api/auth/whatsapp/initiate    // Generate OAuth URL
GET    /api/auth/whatsapp/callback    // Handle OAuth callback
DELETE /api/auth/whatsapp/disconnect  // Disconnect client

// Messaging
POST   /api/messages/send             // Send message to candidate
GET    /api/messages/:conversationId  // Get conversation history
POST   /webhook                        // Receive messages from Meta

// Management
GET    /api/clients/:id               // Get client info
GET    /api/conversations              // List all conversations
PATCH  /api/conversations/:id/read    // Mark as read
```

### Phase 2: Frontend Integration (Week 2)

**Recruiter Dashboard Features**:

1. **"Connect WhatsApp" Button**
   - Opens OAuth popup
   - Shows connection status
   - Displays connected number

2. **Conversations Sidebar**
   - List of all candidate chats
   - Unread count badges
   - Last message preview
   - Search/filter

3. **Chat Interface**
   - WhatsApp-like UI
   - Send text messages
   - Template selection dropdown
   - Message status indicators (sent/delivered/read)
   - Real-time updates via Socket.io

4. **Candidate Management**
   - Send first message (template required)
   - Bulk messaging
   - Conversation notes

### Phase 3: Real-Time Features (Week 2-3)

**Socket.io Events**:

```javascript
// Server emits
socket.emit("message:received", {
  conversationId,
  message,
  from: "candidate",
});

socket.emit("message:status", {
  messageId,
  status: "delivered",
});

// Client listens
socket.on("message:received", updateConversation);
socket.on("message:status", updateMessageStatus);
```

### Phase 4: Production Deployment (Week 3-4)

**Environment Setup**:

```bash
# .env.production
META_APP_ID=your_production_app_id
META_APP_SECRET=your_production_secret
WEBHOOK_VERIFY_TOKEN=secure_random_token
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
SOCKET_URL=https://linkojob.com
```

**Webhook Configuration**:

- Production URL: `https://api.linkojob.com/webhook`
- SSL certificate required
- Webhook signature verification enabled

**Security Enhancements**:

- ✅ Encrypt access tokens in database
- ✅ Implement token refresh logic
- ✅ Verify webhook signatures
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization

---

## 📊 Differences: POC vs Production

| Aspect                | POC                  | Production                     |
| --------------------- | -------------------- | ------------------------------ |
| **Storage**           | In-memory Map()      | MongoDB with encryption        |
| **Testing**           | Manual URL visits    | Frontend UI with buttons       |
| **Client Connection** | Copy/paste OAuth URL | "Connect WhatsApp" button      |
| **Messaging**         | URL parameters       | Chat interface UI              |
| **Real-time**         | None                 | Socket.io for live updates     |
| **Persistence**       | Lost on restart      | Permanent database storage     |
| **Security**          | Plain tokens         | Encrypted tokens + signatures  |
| **Webhook**           | ngrok temporary URL  | Production domain with SSL     |
| **Multi-client**      | Single test client   | Unlimited clients supported    |
| **Environment**       | Development mode     | Production Meta app (verified) |

---

## 🛠️ What Needs to Be Done

### Technical Tasks

**Backend** (3-4 days):

- [ ] Replace Map() with MongoDB
- [ ] Implement token encryption/decryption
- [ ] Add webhook signature verification
- [ ] Create API routes for frontend
- [ ] Implement Socket.io for real-time
- [ ] Add error handling & logging
- [ ] Create database indexes for performance

**Frontend** (4-5 days):

- [ ] "Connect WhatsApp" button with OAuth popup
- [ ] Chat interface component (WhatsApp-like UI)
- [ ] Conversations sidebar with search/filter
- [ ] Template selector for first messages
- [ ] Real-time message updates (Socket.io)
- [ ] Notification system for new messages
- [ ] Message status indicators

**DevOps** (2-3 days):

- [ ] Deploy to production server
- [ ] Configure SSL for webhook
- [ ] Set up monitoring & alerts
- [ ] Database backups
- [ ] Load testing

### Business Tasks

**Meta Business Verification** (2-7 days):

- [ ] Submit business documents:
  - Registre du Commerce (RC)
  - Tax ID (IF/ICE)
  - Utility Bill
- [ ] Wait for Meta approval
- [ ] Move app from Development to Live mode

**Message Templates** (1-2 days):

- [ ] Create job opportunity templates
- [ ] Create follow-up templates
- [ ] Submit for Meta approval
- [ ] Wait 24-48h for approval

---

## 💰 Cost Analysis

### Development Costs

- WhatsApp API: **FREE** (Meta doesn't charge for API access)
- Messaging costs: **0.40 MAD** per marketing/outreach message
- Reply messages: **FREE** (within 24h window)
- Infrastructure: Existing servers (no extra cost)

### Monthly Estimates

**Scenario 1**: 10 recruiters, each contacts 50 candidates/month

- Outreach messages: 10 × 50 = 500 messages × 0.40 MAD = **200 MAD/month**
- Reply handling: FREE
- **Total: ~200 MAD/month**

**Scenario 2**: 50 recruiters, each contacts 100 candidates/month

- Outreach messages: 50 × 100 = 5,000 messages × 0.40 MAD = **2,000 MAD/month**
- **Total: ~2,000 MAD/month**

**Cost Comparison**:

- Current SMS cost: 0.29 MAD/message (both ways)
- WhatsApp: 0.40 MAD first message, FREE replies
- **Advantage**: WhatsApp saves on reply costs (huge volume)

---

## 📚 Important Links & Resources

### Meta Documentation

- **Meta for Developers**: https://developers.facebook.com/apps
- **WhatsApp Business Platform**: https://developers.facebook.com/docs/whatsapp
- **Embedded Signup Guide**: https://developers.facebook.com/docs/whatsapp/embedded-signup
- **Cloud API Reference**: https://developers.facebook.com/docs/whatsapp/cloud-api

### Tools Used

- **ngrok**: https://ngrok.com (for local webhook testing)
- **Node.js**: https://nodejs.org
- **Express**: https://expressjs.com
- **Axios**: https://axios-http.com

### Our POC Files

- Project folder: `k:/work space/Projects/Linkopus/twilio/whatsapp-poc/`
- Server code: [server.js](whatsapp-poc/server.js)
- Documentation: [README.md](whatsapp-poc/README.md)

---

## 🎯 Next Steps & Timeline

### This Week (Feb 17-21)

1. **Team review** of POC results ✅ (Today)
2. **Decision**: Proceed with Embedded Signup vs Virtual Numbers
3. **Start backend development** (MongoDB integration)
4. **Submit Meta business verification** (parallel task)

### Week 2 (Feb 24-28)

1. Complete backend API
2. Start frontend development
3. Create message templates
4. Submit templates for Meta approval

### Week 3 (Mar 3-7)

1. Complete frontend UI
2. Integration testing
3. Security audit
4. Deploy to staging

### Week 4 (Mar 10-14)

1. User acceptance testing
2. Production deployment
3. Monitor and optimize
4. Train team on new system

**Target Launch**: **Mid-March 2026**

---

## ✅ Recommended Decision

**Proceed with Case 1: Embedded Signup**

**Pros**:

- ✅ Clients use their own trusted numbers
- ✅ No monthly fees for virtual numbers
- ✅ Better candidate trust (messages from known company)
- ✅ POC already validated the technical approach
- ✅ Clients have full control of their WhatsApp Business

**Cons**:

- ⚠️ Clients need WhatsApp Business account (not difficult)
- ⚠️ Clients must delete existing WhatsApp app first (if personal use)
- ⚠️ Initial setup requires client authorization

**Alternative: Case 2 (Virtual Numbers)** would cost **10.50 MAD/month per client** but provides zero friction onboarding.

---

## 📞 Questions for Team Discussion

1. Do our target clients already have WhatsApp Business accounts?
2. Are they willing to connect their business number to our platform?
3. Should we offer both options (own number + virtual number)?
4. What's the timeline for Meta business verification?
5. Who will handle message template creation and approval?
6. What's the priority: fast launch vs perfect UX?

---

**Prepared by**: Development Team  
**POC Status**: ✅ Successful  
**Recommendation**: ✅ Proceed to Production Development

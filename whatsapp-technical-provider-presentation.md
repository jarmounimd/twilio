# WhatsApp Recruitment Microservice - Meta Technical Provider Model
## Professional Presentation for Internal Stakeholders

**Date**: February 12, 2026  
**Model**: Meta Technical Provider with Embedded Signup  
**Billing Strategy**: Platform-Managed Aggregated Payments  
**Target Market**: Morocco Recruitment Agencies  

---

## 1. Executive Summary: The Meta Cloud Solution

### Why Official Meta Cloud API vs. Unofficial Bots

| Factor | Official Meta Cloud API ✅ | Unofficial Bots ❌ |
|--------|---------------------------|-------------------|
| **Account Safety** | Zero ban risk - Meta-certified integration | High ban risk - violates WhatsApp ToS |
| **Scalability** | Unlimited numbers after Business Verification | Limited to single number, frequent blocks |
| **2026 Compliance** | BSUID privacy updates (June 2026) | Non-compliant, future shutdowns likely |
| **Message Delivery** | 99.9% delivery rate, status webhooks | Unreliable, no delivery confirmation |
| **Cost Structure** | Transparent per-message pricing | Hidden costs, proxy fees, maintenance |
| **Support** | Official Meta Business Support | None - DIY troubleshooting |

**Bottom Line**: Using Meta's Official API is the **only compliant, scalable, and future-proof solution** for recruitment messaging in 2026.

---

## 2. CEO's Administrative Checklist (Morocco 2026)

### What You Need for Business Verification (Unlock Unlimited Numbers)

#### **Required Legal Documents**

✅ **Official RC (Registre du Commerce)**
- Original certificate from OMPIC
- Must match company name exactly
- Valid and not expired

✅ **Tax ID (Identifiant Fiscal - IF) or ICE**
- Official tax registration number
- Links company to Moroccan tax authority
- Required for Meta's KYC process

✅ **Utility Bill (Water/Electricity/Internet)**
- Must match RC registered address
- Dated within last 3 months
- Company name clearly visible

✅ **Two-Factor Authentication (2FA)**
- Enable on Meta Business Manager account
- SMS or Authenticator app required
- Non-negotiable security requirement

#### **Verification Process Timeline**

| Step | Action | Duration |
|------|--------|----------|
| 1 | Submit documents via Meta Business Suite | 5 minutes |
| 2 | Meta reviews (automated + manual) | 2-7 business days |
| 3 | Approval notification | Instant |
| 4 | Unlock unlimited phone numbers | Immediate |

**Access Meta Business Suite**: https://business.facebook.com/settings/whatsapp-business-accounts

⚠️ **Critical**: Without Business Verification, you're limited to **2 phone numbers** and **250 conversations/day**.

---

## 3. Financial Breakdown (Cost in MAD)

### 2026 WhatsApp Pricing - Rest of Africa Tier

**Exchange Rate**: 1 USD = 10.5 MAD (February 2026)

#### **Message Costs Per Category**

| Message Type | USD Price | MAD Price | When Charged |
|--------------|-----------|-----------|--------------|
| **Utility Template** (Recruiter Initiates) | $0.0047 | **~0.05 MAD** | When delivered to candidate |
| **Free-Form Reply** (24h Window) | $0.00 | **0.00 MAD** | FREE if sent within 24 hours |
| **Inbound Messages** (Candidate Replies) | $0.00 | **0.00 MAD** | Always FREE |
| **Marketing Template** | $0.0544 | ~0.57 MAD | Promotional content (not needed) |
| **Authentication Template** | $0.0126 | ~0.13 MAD | OTP codes (not needed) |

#### **Real-World Cost Examples**

| Recruitment Scale | Template Messages | Free Replies | Total Cost |
|-------------------|-------------------|--------------|------------|
| **Small Agency** (100 candidates/month) | 100 × 0.05 MAD | 0 MAD | **5 MAD** |
| **Medium Agency** (500 candidates/month) | 500 × 0.05 MAD | 0 MAD | **25 MAD** |
| **Large Agency** (2,000 candidates/month) | 2,000 × 0.05 MAD | 0 MAD | **100 MAD** |

**Note**: After initial contact, all back-and-forth within 24 hours is FREE. Average recruitment conversations need only **1 template message** + **3-5 free replies**.

#### **Platform Fees**

| Service | Cost |
|---------|------|
| **Third-Party Platforms** (Twilio, MessageBird, etc.) | 200-400% markup |
| **Direct Meta Integration** (Our Model) | **0.00 MAD** |

💰 **Savings**: By going direct to Meta, we eliminate platform fees entirely. A client messaging 1,000 candidates pays **50 MAD** instead of 150-200 MAD with third parties.

---

### Aggregated Billing Strategy

#### **How It Works**

1. **Single Meta Business Manager** owned by our company (Linkopus)
2. **Shared Credit Line** linked to our corporate credit card
3. **All client phone numbers** registered under our WABA (WhatsApp Business Account)
4. **Meta bills us monthly** for aggregate usage across all clients
5. **We invoice clients** based on their individual message counts

#### **Technical Implementation**

```
Meta Cloud API → Our WABA → Multiple Client Numbers
                     ↓
              Single Invoice to Us
                     ↓
         We Reconcile Per Client
                     ↓
    Monthly Subscription + Usage Fees
```

**Client Experience**: 
- ✅ No credit card needed
- ✅ No direct Meta relationship
- ✅ Pay us via subscription (e.g., 200 MAD base + 0.10 MAD per message)
- ✅ We absorb Meta's 0.05 MAD cost, earn 0.05 MAD margin

**Financial Control**: 
- We set credit limits per client (prevent runaway costs)
- Real-time usage tracking in our dashboard
- Auto-pause if client exceeds limit

---

## 4. Client Onboarding & Benefits

### 3-Step Client Experience

#### **Step 1: Purchase** (1 minute)
- Client selects recruitment package on our website
- Example: "Recruiter Pro Plan - 200 MAD/month + 0.10 MAD per message"
- Checkout via credit card / bank transfer
- No need to create Meta Business Manager

#### **Step 2: Connect** (2 minutes)
- Client clicks **"Connect WhatsApp Number"** in our dashboard
- **Embedded Signup Flow** appears (Meta's iframe)
- Client scans QR code with their WhatsApp Business app
- Grants permissions: "Allow Linkopus to send/receive messages"
- ✅ Done - Number is now linked

**Behind the Scenes**:
```javascript
// Meta returns these credentials to us
{
  "phone_number_id": "123456789012345",
  "waba_id": "987654321098765",
  "access_token": "EAAG...long_token"
}
// We store these in MongoDB linked to ClientID
```

#### **Step 3: Launch** (Immediate)
- Client's WhatsApp number appears in our dashboard
- They can immediately:
  - Create message templates
  - Upload candidate lists
  - Start sending recruitment messages
- **Isolation Guarantee**: Their candidates only see their number, never ours or other clients'

### Key Client Benefits

| Benefit | Description |
|---------|-------------|
| 🚀 **5-Minute Setup** | No technical knowledge needed |
| 💳 **Zero Meta Account** | Don't need Facebook Business Manager |
| 🔒 **Data Isolation** | Each client's data is siloed |
| 📊 **Real-Time Dashboard** | See delivery, reads, replies instantly |
| 💰 **Transparent Billing** | Pay only for messages sent |
| ⚡ **Instant Replies** | WebSocket notifications < 100ms |

---

## 5. Developer Microservice Architecture (My Role)

### High-Level Technical Design

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET (Public)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────▼────────────┐
                │   Meta Cloud API        │
                │   (Webhook Sender)      │
                └────────────┬────────────┘
                             │
                    POST /webhook/whatsapp
                             │
┌────────────────────────────▼────────────────────────────────┐
│              Node.js Express Server (Port 3000)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Verify Webhook Signature (HMAC-SHA256)          │   │
│  │  2. Parse JSON Payload                              │   │
│  │  3. Extract phone_number_id                         │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │  ROUTING GATEWAY (Multi-Tenant Logic)               │   │
│  │  - Query MongoDB: phone_number_id → CompanyID      │   │
│  │  - Load company's WABA credentials                  │   │
│  │  - Route message to correct Socket.io room          │   │
│  └───────────────────┬──────────────────────────────────┘   │
│                      │                                       │
│         ┌────────────┴────────────┐                          │
│         ▼                         ▼                          │
│  ┌─────────────┐         ┌─────────────┐                    │
│  │   Store in  │         │  Broadcast  │                    │
│  │   MongoDB   │         │  Socket.io  │                    │
│  │             │         │   Event     │                    │
│  │ (messages)  │         │  to Client  │                    │
│  └─────────────┘         └─────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │ Client A     │          │ Client B     │
        │ Dashboard    │          │ Dashboard    │
        │ (Socket.io)  │          │ (Socket.io)  │
        └──────────────┘          └──────────────┘
```

### Component 1: Routing Gateway

**Challenge**: Single `/webhook` endpoint receives messages for 50+ client numbers.

**Solution**: Use `phone_number_id` from Meta's JSON payload as routing key.

```javascript
// Simplified routing logic
app.post('/webhook/whatsapp', async (req, res) => {
  // 1. Verify signature
  if (!verifySignature(req.body, req.headers['x-hub-signature-256'])) {
    return res.status(401).send('Invalid signature');
  }

  // 2. Extract phone_number_id
  const phoneNumberId = req.body.entry[0].changes[0].value.metadata.phone_number_id;
  
  // 3. Find which company owns this number
  const company = await db.collection('companies').findOne({ 
    phoneNumberId: phoneNumberId 
  });
  
  if (!company) {
    return res.status(404).send('Unknown number');
  }

  // 4. Parse message
  const message = parseWebhookPayload(req.body);
  
  // 5. Store in MongoDB
  await db.collection('messages').insertOne({
    companyId: company._id,
    candidatePhone: message.from,
    text: message.text,
    timestamp: new Date(),
    direction: 'inbound'
  });

  // 6. Broadcast to correct Socket.io room
  io.to(`company_${company._id}`).emit('message:received', {
    candidatePhone: message.from,
    text: message.text,
    timestamp: new Date()
  });

  res.sendStatus(200);
});
```

**Result**: Each company only sees their own conversations, even though all webhooks hit the same URL.

---

### Component 2: Template Engine (Multi-Tenant)

**Challenge**: Manage templates for 50+ companies, each with custom variables.

**Architecture**:

```javascript
// Template stored in MongoDB
{
  _id: ObjectId("..."),
  companyId: ObjectId("..."),
  templateName: "job_offer_notification",
  language: "fr",
  category: "UTILITY",
  status: "APPROVED",  // By Meta
  components: [
    {
      type: "BODY",
      text: "Bonjour {{1}}, nous avons une opportunité {{2}} qui pourrait vous intéresser."
    }
  ],
  metaTemplateId: "123456789"  // Meta's template ID
}

// Usage when sending
async function sendTemplateMessage(companyId, candidatePhone, templateName, variables) {
  // 1. Fetch company credentials
  const company = await db.collection('companies').findOne({ _id: companyId });
  
  // 2. Fetch template
  const template = await db.collection('templates').findOne({ 
    companyId: companyId, 
    templateName: templateName,
    status: "APPROVED"
  });
  
  // 3. Call Meta API
  const response = await axios.post(
    `https://graph.facebook.com/v21.0/${company.phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to: candidatePhone,
      type: "template",
      template: {
        name: template.metaTemplateId,
        language: { code: template.language },
        components: [
          {
            type: "body",
            parameters: variables.map(v => ({ type: "text", text: v }))
          }
        ]
      }
    },
    {
      headers: { 'Authorization': `Bearer ${company.accessToken}` }
    }
  );
  
  // 4. Store message in MongoDB
  await db.collection('messages').insertOne({
    companyId: companyId,
    candidatePhone: candidatePhone,
    messageId: response.data.messages[0].id,
    templateName: templateName,
    variables: variables,
    status: 'sent',
    timestamp: new Date(),
    direction: 'outbound'
  });
}
```

**Template Submission Flow**:
1. Company creates template in our dashboard
2. Our backend calls Meta's Template API to submit for review
3. Meta approves (1-24 hours)
4. We mark template as `APPROVED` in MongoDB
5. Template now available for sending

---

### Component 3: Real-Time Layer (Socket.io)

**Goal**: Push candidate replies to recruiter's browser in < 100ms.

**Implementation**:

```javascript
// Server-side: Socket.io setup
const io = require('socket.io')(server, {
  cors: { origin: 'https://app.linkopus.com' }
});

// When recruiter opens dashboard
io.on('connection', (socket) => {
  // Authenticate socket
  const companyId = socket.handshake.auth.companyId;
  
  // Join company-specific room
  socket.join(`company_${companyId}`);
  
  console.log(`Company ${companyId} connected to real-time feed`);
});

// When webhook arrives (from routing gateway)
io.to(`company_${companyId}`).emit('message:received', {
  candidatePhone: '+212612345678',
  candidateName: 'Ahmed El Fassi',
  text: 'Oui, je suis intéressé!',
  timestamp: '2026-02-12T14:30:00Z',
  conversationId: 'conv_abc123'
});
```

**Client-side (React Dashboard)**:

```javascript
import { io } from 'socket.io-client';

const socket = io('wss://api.linkopus.com', {
  auth: { companyId: currentUser.companyId }
});

socket.on('message:received', (data) => {
  // Update UI instantly
  setConversations(prev => [...prev, data]);
  
  // Show browser notification
  new Notification('New Reply!', {
    body: `${data.candidateName}: ${data.text}`
  });
  
  // Play sound
  playNotificationSound();
});
```

**Latency Breakdown**:
- Meta sends webhook: ~50ms
- Our server processes: ~20ms
- Socket.io emits: ~10ms
- Browser receives: ~20ms
- **Total**: < 100ms

---

## 6. Database Schema (MongoDB Structure)

### Collection 1: `companies`

```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6789012345a"),
  companyName: "TalentHub Morocco",
  industry: "IT Recruitment",
  subscriptionPlan: "Pro",  // Basic, Pro, Enterprise
  subscriptionStatus: "active",  // active, suspended, cancelled
  
  // Meta WhatsApp Credentials (from Embedded Signup)
  wabaId: "987654321098765",
  phoneNumberId: "123456789012345",
  phoneNumber: "+212520123456",
  accessToken: "EAAG...long_token",  // Encrypted in production
  
  // Billing
  creditLimit: 1000,  // Maximum MAD spend per month
  currentBalance: 245.50,  // Current month usage
  billingEmail: "billing@talenthub.ma",
  
  // Contact
  adminName: "Fatima Zahra",
  adminEmail: "fatima@talenthub.ma",
  adminPhone: "+212661234567",
  
  // Timestamps
  createdAt: ISODate("2026-01-15T10:30:00Z"),
  lastActiveAt: ISODate("2026-02-12T09:15:00Z"),
  
  // Status
  isVerified: true,  // Meta Business Verification
  isActive: true
}
```

**Indexes**:
- `{ phoneNumberId: 1 }` - Fast webhook routing
- `{ wabaId: 1 }` - Query by WhatsApp Business Account
- `{ subscriptionStatus: 1, lastActiveAt: -1 }` - Active companies

---

### Collection 2: `conversations`

```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6789012345b"),
  conversationId: "conv_abc123",  // Our internal ID
  
  // Relationship
  companyId: ObjectId("65a1b2c3d4e5f6789012345a"),
  candidatePhone: "+212612345678",
  candidateName: "Ahmed El Fassi",  // Extracted from first message
  
  // Recruitment Context
  jobPosition: "Full Stack Developer",
  jobId: ObjectId("65a1b2c3d4e5f6789012345c"),
  recruiterName: "Fatima Zahra",
  recruiterId: ObjectId("65a1b2c3d4e5f6789012345d"),
  
  // Status
  conversationStatus: "active",  // active, closed, archived, opted_out
  stage: "initial_contact",  // initial_contact, screening, interview_scheduled, offer_sent, hired, rejected
  
  // Activity
  lastMessageAt: ISODate("2026-02-12T14:30:00Z"),
  lastMessageFrom: "candidate",  // candidate | recruiter
  messageCount: 12,
  unreadCount: 2,  // Recruiter hasn't read
  
  // Compliance
  hasConsent: true,  // GDPR - candidate agreed to messaging
  consentDate: ISODate("2026-02-01T10:00:00Z"),
  
  // Timestamps
  createdAt: ISODate("2026-02-01T10:00:00Z"),
  updatedAt: ISODate("2026-02-12T14:30:00Z")
}
```

**Indexes**:
- `{ companyId: 1, conversationStatus: 1, lastMessageAt: -1 }` - Active conversations
- `{ companyId: 1, candidatePhone: 1 }` - Find conversation by phone (unique)
- `{ companyId: 1, unreadCount: 1 }` - Unread messages
- `{ lastMessageAt: 1 }` - Archive old conversations (TTL)

---

### Collection 3: `messages`

```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6789012345e"),
  
  // Relationship
  conversationId: ObjectId("65a1b2c3d4e5f6789012345b"),
  companyId: ObjectId("65a1b2c3d4e5f6789012345a"),
  
  // Meta WhatsApp IDs
  messageId: "wamid.HBgNMjEyNjEyMzQ1Njc4FQIAERgSNEQyOTk1...",  // From Meta
  wabaId: "987654321098765",
  phoneNumberId: "123456789012345",
  
  // Content
  direction: "outbound",  // outbound (recruiter→candidate) | inbound (candidate→recruiter)
  from: "recruiter",  // recruiter | candidate
  candidatePhone: "+212612345678",
  
  messageType: "template",  // template | text | image | document | audio | video
  templateName: "job_offer_notification",  // If type = template
  
  content: {
    text: "Bonjour Ahmed, nous avons une opportunité Full Stack Developer qui pourrait vous intéresser.",
    mediaUrl: null,  // For images/documents
    mediaType: null,
    fileName: null
  },
  
  // Status Tracking
  status: "read",  // sent → delivered → read → failed
  statusHistory: [
    { status: "sent", timestamp: ISODate("2026-02-12T14:30:00Z") },
    { status: "delivered", timestamp: ISODate("2026-02-12T14:30:05Z") },
    { status: "read", timestamp: ISODate("2026-02-12T14:32:00Z") }
  ],
  
  // Cost (for billing reconciliation)
  cost: 0.05,  // MAD
  charged: true,  // Counted in monthly invoice
  
  // Metadata
  timestamp: ISODate("2026-02-12T14:30:00Z"),
  createdAt: ISODate("2026-02-12T14:30:00Z"),
  
  // Error handling
  errorCode: null,
  errorMessage: null,
  retryCount: 0
}
```

**Indexes**:
- `{ conversationId: 1, timestamp: -1 }` - Message history (most recent first)
- `{ companyId: 1, timestamp: -1 }` - All company messages (billing)
- `{ messageId: 1 }` - Idempotency (prevent duplicates)
- `{ companyId: 1, charged: 1, timestamp: 1 }` - Monthly billing query
- `{ status: 1, timestamp: 1 }` - Failed messages for retry

---

### Collection 4: `templates`

```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6789012345f"),
  
  // Ownership
  companyId: ObjectId("65a1b2c3d4e5f6789012345a"),
  createdBy: "Fatima Zahra",
  
  // Meta Template Details
  metaTemplateId: "1234567890",  // From Meta after approval
  templateName: "job_offer_notification",
  category: "UTILITY",  // UTILITY | MARKETING | AUTHENTICATION
  language: "fr",
  
  // Content
  components: [
    {
      type: "BODY",
      text: "Bonjour {{1}}, nous avons une opportunité {{2}} qui pourrait vous intéresser. Salaire: {{3}}. Contactez-nous au {{4}}.",
      variables: ["Nom du candidat", "Poste", "Salaire", "Téléphone"]
    }
  ],
  
  // Status
  status: "APPROVED",  // DRAFT | PENDING | APPROVED | REJECTED
  rejectionReason: null,
  
  // Usage Stats
  usageCount: 245,  // Times sent
  lastUsedAt: ISODate("2026-02-12T14:30:00Z"),
  
  // Timestamps
  submittedAt: ISODate("2026-01-20T10:00:00Z"),
  approvedAt: ISODate("2026-01-21T15:30:00Z"),
  createdAt: ISODate("2026-01-20T10:00:00Z")
}
```

**Indexes**:
- `{ companyId: 1, status: 1 }` - Active templates
- `{ metaTemplateId: 1 }` - Lookup by Meta ID

---

## 7. 2026 Privacy Compliance

### BSUID (Business-Scoped User IDs) - June 2026 Update

**What Changed**: 
Starting June 2026, WhatsApp no longer exposes the candidate's actual phone number (`+212612345678`) in webhook payloads. Instead, Meta provides a **Business-Scoped User ID (BSUID)** like `bsuid_ABC123XYZ`.

**Why**: Enhanced privacy - candidates can't be tracked across multiple businesses.

**Impact on Our Architecture**: ✅ **Already Compatible**

```javascript
// OLD (Before June 2026)
{
  "from": "+212612345678",  // Real phone number
  "text": "Oui, je suis intéressé!"
}

// NEW (After June 2026)
{
  "from": "bsuid_ABC123XYZ",  // Business-scoped ID
  "text": "Oui, je suis intéressé!"
}
```

**Our Solution**:

1. **Database Update**: Change `candidatePhone` field to `candidateIdentifier` (supports both formats)
2. **Backward Compatibility**: Detect if value starts with `bsuid_` or `+`
3. **Display Name**: Fetch candidate name from Meta's API instead of showing phone number

```javascript
// Updated schema
{
  candidateIdentifier: "bsuid_ABC123XYZ",  // BSUID or phone
  candidateName: "Ahmed El Fassi",  // From Meta Profile API
  candidatePhone: "+212612345678"  // Only if candidate shared in chat
}
```

**Compliance Checklist**:

✅ **Data Minimization**: Only store necessary candidate data  
✅ **Consent Tracking**: `hasConsent` flag in conversations  
✅ **Right to Deletion**: GDPR deletion API endpoint  
✅ **Opt-Out Handling**: `opted_out` conversation status  
✅ **Secure Storage**: Encrypt `accessToken` at rest  
✅ **Webhook Verification**: Always verify Meta signatures  
✅ **BSUID Ready**: Schema supports both phone and BSUID formats  

---

## Quick Reference Tables

### Technical Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | v20 LTS | Server-side JavaScript |
| **Framework** | Express | v4.x | REST API + Webhooks |
| **Database** | MongoDB Atlas | v7.x | Document storage |
| **Real-Time** | Socket.io | v4.x | WebSocket push notifications |
| **HTTP Client** | Axios | v1.x | Meta API calls |
| **Authentication** | JWT | - | Company session tokens |
| **Encryption** | bcrypt | - | Password hashing |
| **Validation** | Joi | - | Input validation |

### Meta API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /v21.0/{phone_number_id}/messages` | Send messages |
| `GET /v21.0/{waba_id}/message_templates` | List templates |
| `POST /v21.0/{waba_id}/message_templates` | Create template |
| `GET /v21.0/{phone_number_id}` | Get phone details |
| `POST /v21.0/{waba_id}/subscribed_apps` | Subscribe to webhooks |

### Environment Variables

```env
# Meta Credentials
META_APP_ID=123456789012345
META_APP_SECRET=abc123...
META_WEBHOOK_VERIFY_TOKEN=mySecretToken123

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/recruitment
MONGODB_DB_NAME=whatsapp_recruitment

# Server
PORT=3000
NODE_ENV=production
BASE_URL=https://api.linkopus.com

# JWT
JWT_SECRET=superSecretKey...
JWT_EXPIRY=7d

# Socket.io
SOCKET_CORS_ORIGIN=https://app.linkopus.com
```

---

## Next Steps

### Week 1: Foundation
- [ ] Create Meta Developer App
- [ ] Configure webhook endpoint (`/webhook/whatsapp`)
- [ ] Set up MongoDB Atlas cluster
- [ ] Implement signature verification
- [ ] Test with Meta's test number

### Week 2: Multi-Tenant Logic
- [ ] Build routing gateway (phone_number_id → company)
- [ ] Implement Embedded Signup flow
- [ ] Create company onboarding UI
- [ ] Test with 2 dummy companies

### Week 3: Messaging Features
- [ ] Template submission API
- [ ] Send template message endpoint
- [ ] Receive webhook and parse
- [ ] Store messages in MongoDB
- [ ] WebSocket real-time push

### Week 4: Dashboard & Billing
- [ ] Build React dashboard (conversation list)
- [ ] Usage tracking per company
- [ ] Monthly billing reconciliation
- [ ] Invoice generation

### Week 5: Production
- [ ] Deploy to Azure/AWS
- [ ] Set up monitoring (Datadog/New Relic)
- [ ] Load testing (1,000 messages/sec)
- [ ] Meta Business Verification

---

**Document Version**: 1.0  
**Last Updated**: February 12, 2026  
**Owner**: Linkopus Development Team  
**Presentation Duration**: 15 minutes

# WhatsApp Recruitment Platform - Team Presentation

**Date**: February 12, 2026  
**Purpose**: Integrate Official Meta WhatsApp into Our Recruitment Platform  
**Goal**: Clients connect their WhatsApp numbers easily - We handle everything  

---

## 1. Why Meta Cloud API?

**Simple Answer**: It's the only legal, reliable way to use WhatsApp for business in 2026.

**Benefits**:
- ✅ Zero risk of account bans
- ✅ Unlimited client numbers
- ✅ Official Meta support
- ✅ Reliable message delivery
- ✅ Cost: 0.05 MAD per message
- ✅ Free replies within 24 hours

---

## 2. What Our CEO Needs to Prepare

### Required Documents (Morocco)

| Document | Where to Get It | Notes |
|----------|-----------------|-------|
| **RC (Registre du Commerce)** | OMPIC | Company registration certificate |
| **Tax ID (IF or ICE)** | Tax Authority | Official tax number |
| **Utility Bill** | LYDEC/REDAL/AMENDIS | Recent (last 3 months), matches RC address |

### Setup Process

1. **Create Meta Business Account**
   - Go to: https://business.facebook.com
   - Sign up with company email
   - Enable 2FA (required)

2. **Submit Documents for Verification**
   - Upload RC, Tax ID, Utility Bill
   - Wait: 2-7 business days
   - Result: Unlimited phone numbers unlocked

3. **Get WhatsApp Business API Access**
   - Go to: https://business.facebook.com/settings/whatsapp-business-accounts
   - Create WhatsApp Business Account (WABA)
   - Add our company card for billing

**Timeline**: 1-2 weeks total

---

## 3. What It Will Cost

### Meta Charges (Billed to Us Monthly)

| What | Price | When |
|------|-------|------|
| **First Message to Candidate** | 0.05 MAD | When recruiter initiates contact |
| **All Replies Within 24 Hours** | FREE | Candidate replies, we reply back |
| **Candidate Messages to Us** | FREE | Always free |

### Real Examples

| Client Size | Candidates/Month | Cost to Us | We Charge Client | Our Margin |
|-------------|------------------|------------|------------------|------------|
| Small Agency | 100 | 5 MAD | 15 MAD | 10 MAD |
| Medium Agency | 500 | 25 MAD | 75 MAD | 50 MAD |
| Large Agency | 2,000 | 100 MAD | 300 MAD | 200 MAD |

### How We Get Paid

**Client Subscription Model**:
- Base: 200 MAD/month
- Plus: 0.15 MAD per message sent
- Client pays us monthly
- We handle Meta payments
- **Client never deals with Meta directly**

### Meta Setup Costs

| Item | Cost |
|------|------|
| Business Verification | **FREE** |
| WhatsApp Business Account | **FREE** |
| API Access | **FREE** |
| Monthly Platform Fee | **0 MAD** (pay-per-message only) |

**Total Upfront Cost**: 0 MAD

---

## 4. How to Get Meta Setup Ready

### Step-by-Step Links

1. **Create Meta Business Account**
   - Link: https://business.facebook.com
   - Click "Create Account"
   - Use company email (not personal)

2. **Enable 2FA Security**
   - Link: https://business.facebook.com/settings/security
   - Turn on Two-Factor Authentication
   - Use Google Authenticator or SMS

3. **Submit Business Verification**
   - Link: https://business.facebook.com/settings/security/business_verification
   - Upload: RC + Tax ID + Utility Bill
   - Wait 2-7 days for approval

4. **Create WhatsApp Business Account (WABA)**
   - Link: https://business.facebook.com/settings/whatsapp-business-accounts
   - Click "Add" → "Create WhatsApp Business Account"
   - Add phone number
   - Add payment method (company credit card)

5. **Get API Access**
   - Link: https://developers.facebook.com/apps
   - Create new app → Choose "Business"
   - Add WhatsApp product
   - Get credentials: App ID, App Secret, Access Token

**Documentation**: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started

---

## 5. How It Integrates Into Our Platform

### Current Platform
- Clients post jobs
- Candidates apply
- We manage recruitment process

### After WhatsApp Integration
- **Same platform** + WhatsApp messaging feature
- New button: "Connect WhatsApp"
- New tab: "WhatsApp Conversations"
- Everything else stays the same

### What Changes for Clients
7. Developer's Microservice Architecture
**Before**:
1. Client posts job
2. Candidate applies
3. Client calls candidate manually

**After**:
1. Client posts job
2. Client clicks "Send WhatsApp Message"
3. Message sent automatically
4. Candidate replies appear in dashboard
5. Client chats in real-time

**We Handle**:
- All Meta technical setup
- All billing with Meta
- Message delivery
- Webhook processing
- Real-time notifications
- Data storage

**Client Just**:
- Connects their WhatsApp number (1-click)
- Types messages
- Sees replies instantly

---

## 6. How Clients Benefit (Simple Steps)

### For the Client - 3 Easy Steps

**Step 1: Subscribe** (2 minutes)
- Client buys our WhatsApp add-on: 200 MAD/month
- No Meta account needed
- No technical setup required

**Step 2: Connect Number** (1 minute)
- Click "Connect WhatsApp" in dashboard
- Scan QR code with their phone
- Done - number is connected

**Step 3: Start Messaging** (Immediate)
- Upload candidate list
- Click "Send to All"
- See replies in real-time
- Track who read, who replied

### What Makes It Easy

| Feature | Benefit |
|---------|---------|
| **No Meta Account** | We handle everything with Meta |
| **No Credit Card to Meta** | They pay us, we pay Meta |
| **1-Click Connect** | QR code scan, that's it |
| **All in Our Dashboard** | No switching between apps |
| **Real-Time Replies** | See messages instantly |
| **Transparent Costs** | See exact cost per message sent |

### Why This Matters

**Old Way** (Phone Calls):
- Time: 5 minutes per candidate
- Cost: 2-3 MAD per call
- Result: 50% don't answer

**New Way** (WhatsApp):
- Time: 5 seconds per candidate
- Cost: 0.05 MAD per message
- Result: 90% read within 1 hour

---

## 5. Developer Microservice Architecture (My Role)

### What You'll Build

**3 Main Components**:

1. **Webhook Receiver**
   - Receives messages from Meta
   - Verifies they're really from Meta (security)
   - Figures out which client the message belongs to

2. **Message Router**
   - Takes incoming message
   - Looks up which client owns that WhatsApp number
   - Sends message to correct client's dashboard

3. **Real-Time Notifier**
   - Uses WebSockets (Socket.io)
   - Pushes new messages to client's browser instantly
   - Client sees reply in < 100ms

### How It Works

**When Candidate Sends Message**:
1. Candidate types on WhatsApp
2. Meta receives it
3. Meta sends it to our webhook (POST request)
4. Our server checks: "Which client owns this number?"
5. Finds client in database
6. Saves message to database
7. Pushes notification to client's browser
8. Client sees it instantly

**When Client Sends Message**:
1. Client types in our dashboard
2. Frontend calls our API
3. Our server looks up client's Meta credentials
4. Calls Meta API to send message
5. Meta delivers to candidate
6. Save to database
7. Update UI with "Sent" status

### Key Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Backend** | Node.js + Express | Best for webhooks and real-time |
| **Database** | MongoDB | Flexible for messages and nested data |
| **Real-Time** | Socket.io | Industry standard for WebSockets |
| **Hosting** | Single webhook URL | Route all clients through one endpoint |

### Architecture Diagram

```
Meta Cloud API
      ↓
Our Webhook (/webhook/whatsapp)
      ↓
Check: Which client? (lookup phone_number_id)
      ↓
Save to MongoDB
      ↓
Push to Client Dashboard (Socket.io)
```

---

## 6. Database Schema (MongoDB Structure)

### 4 Collections We Need

**1. Companies Collection**
- Stores each client's info
- Their WhatsApp number
- Meta credentials (phone_number_id, access_token)
- Billing info (how much they've spent)

| Field | What It Stores |
|-------|---------------|
| companyName | "TalentHub Morocco" |
| phoneNumber | "+212520123456" |
| phoneNumberId | "123456789" (Meta's ID) |
| accessToken | Meta API token (encrypted) |
| creditLimit | Max spending per month |
| currentBalance | Current month usage |

**2. Conversations Collection**
- One record per candidate
- Links to company
- Tracks conversation status

| Field | What It Stores |
|-------|---------------|
| companyId | Which client owns this |
| candidatePhone | "+212612345678" |
| candidateName | "Ahmed El Fassi" |
| jobPosition | "Full Stack Developer" |
| conversationStatus | active / closed / archived |
| unreadCount | How many unread messages |
| lastMessageAt | When last message sent |

**3. Messages Collection**
- Every single message
- Sent by recruiter or received from candidate
- Status tracking (sent → delivered → read)

| Field | What It Stores |
|-------|---------------|
| conversationId | Which conversation |
| companyId | Which client |
| direction | "outbound" or "inbound" |
| messageType | template / text / image |
| content | "Bonjour Ahmed..." |
| status | sent / delivered / read |
| cost | 0.05 MAD (for billing) |
| timestamp | When message sent |

**4. Templates Collection**
- Message templates each client creates
- Approved by Meta before use

| Field | What It Stores |
|-------|---------------|
| companyId | Which client owns it |
| templateName | "job_offer_notification" |
| content | "Bonjour {{name}}..." |
| status | DRAFT / PENDING / APPROVED |
| metaTemplateId | Meta's approval ID |
| usageCount | How many times used |

### Why This Structure?

**Multi-Tenant**: Each client's data is separate
- Query by `companyId` keeps data isolated
- One client can't see another's messages

**Fast Lookups**: 
- Find company by `phoneNumberId` (webhook routing)
- Find conversation by `candidatePhone`
- Find messages by `conversationId`

**Billing Ready**:
- Count messages where `charged: true`
- Group by `companyId` for monthly invoices

---

## Summary

**What We're Building**: WhatsApp messaging for recruitment, official Meta API

**CEO Needs**: RC, Tax ID, Utility Bill → Submit to Meta → Wait 2-7 days

**Cost**: 0.05 MAD per first message, FREE after that

**Client Experience**: 1-click connect, instant messaging, we handle Meta

**Developer's Job**: 
1. Webhook to receive Meta messages
2. Router to find correct client
3. MongoDB to store everything
4. Socket.io to push updates

**Next Step**: Get Meta Business Account ready (CEO's task)

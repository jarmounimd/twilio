# 📱 WhatsApp Recruitment Microservice - Implementation Plan

**Project:** Direct WhatsApp Integration for Candidate Recruitment  
**Date:** February 11, 2026  
**Prepared for:** Linkopus Recruitment Team  
**Strategy:** Meta Cloud API Direct (No Third-Party Provider)

---

## 🎯 Project Overview

**What We're Building:**
A WhatsApp-based recruitment communication system that allows recruiters to message candidates directly from our website, with full conversation history and real-time updates.

**How It Works:**

1. Recruiter clicks "Message Candidate" on our website
2. System sends WhatsApp message to candidate's phone number
3. Candidate receives message and can reply
4. All messages stored in MongoDB for history
5. Real-time UI updates via WebSockets show conversation status

**Why Direct Meta API:**

- **0 MAD platform fees** (no third-party markup)
- **FREE candidate replies** (24-hour conversation window)
- **Simple integration** (one API, one provider)
- **Full control** (no vendor lock-in)

---

## ✅ Phase 0: Pre-Coding Checklist

**CRITICAL:** Complete these administrative steps BEFORE writing any code!

### 1️⃣ Meta Business Portfolio Setup

- [ ] Create Meta Business Account at [business.facebook.com](https://business.facebook.com)
- [ ] Add team members with appropriate roles
- [ ] Verify you have Admin access

### 2️⃣ Business Verification

- [ ] Prepare **RC (Registre de Commerce)** - Company registration certificate
- [ ] Prepare **Tax ID (IF - Identifiant Fiscal)** - Morocco tax identification
- [ ] Submit documents to Meta for Business Verification
- [ ] **⏱️ Timeline:** 1-5 business days for approval

### 3️⃣ WhatsApp Business Phone Number

- [ ] Acquire a **NEW, CLEAN** phone number (never used on WhatsApp before)
- [ ] **❌ DO NOT use:** Personal numbers, numbers active on WhatsApp
- [ ] **✅ Recommended:** Get new SIM card from telecom provider
- [ ] Register this number with Meta Business API

### 4️⃣ WhatsApp Business API Access

- [ ] Apply for WhatsApp Business API in Meta Business Manager
- [ ] Select "Meta Cloud API" (Direct Hosting - FREE)
- [ ] Link verified business and phone number
- [ ] Wait for approval (usually 1-2 hours)

### 5️⃣ Generate System User Token

- [ ] Create System User in Business Settings → System Users
- [ ] Assign "WhatsApp Business Management" and "WhatsApp Business Messaging" permissions
- [ ] Generate **Permanent Access Token** (never expires)
- [ ] **🔐 SECURITY:** Store token in environment variables, NEVER commit to Git

**⏱️ Total Pre-Coding Time:** 2-7 business days (mostly waiting for Meta verification)

---

## 📝 Meta Template Strategy

### Why We Need Templates

WhatsApp has strict anti-spam rules. Since **recruiters initiate** the first message (not candidates), we must use pre-approved **Message Templates**.

### Template Type: UTILITY

**What is a Utility Template?**

- Used for account updates, order status, appointments, etc.
- For our use case: Job application updates, interview invitations, recruitment follow-ups
- **Approval time:** 1-24 hours (usually instant)

### Example Template Structure

**Template Name:** `recruitment_initial_contact`  
**Category:** UTILITY  
**Language:** Arabic / French / English

```
مرحبا {{1}}! 👋

شكرا على اهتمامك بوظيفة {{2}} في Linkopus.

نود مناقشة ملفك الشخصي معك. هل أنت متاح للتحدث؟

---
Hello {{1}}! 👋

Thank you for your interest in the {{2}} position at Linkopus.

We would like to discuss your profile with you. Are you available to talk?
```

**Variables:**

- `{{1}}` = Candidate first name
- `{{2}}` = Job position

### After First Message: FREE CONVERSATION

Once the candidate **replies** to our template:

- ✅ **24-hour conversation window opens**
- ✅ **All messages FREE** during this window
- ✅ **No templates needed** - send any text, images, documents
- ✅ Window **resets** each time candidate replies

---

## 💰 Financial Forecast: Morocco 2026

### WhatsApp Business API Pricing (Rest of Africa Tier)

**Exchange Rate:** 1 USD = 10.5 MAD (February 2026)

| Scenario                               | Cost per Message | Notes                         |
| -------------------------------------- | ---------------- | ----------------------------- |
| **Business-Initiated (First Message)** | ~0.50 MAD        | Using approved template       |
| **Candidate Replies**                  | 0.00 MAD (FREE)  | Opens 24-hour window          |
| **Ongoing Conversation**               | 0.00 MAD (FREE)  | All messages free for 24h     |
| **Service Conversation**               | 0.00 MAD (FREE)  | When candidate messages first |
| **Monthly Platform Fee**               | 0.00 MAD         | Meta Cloud API is free        |

### Real Cost Examples

#### Small Scale (50 candidates/month)

| Activity            | Calculation       | Monthly Cost     |
| ------------------- | ----------------- | ---------------- |
| 50 initial messages | 50 × 0.50 MAD     | **25 MAD**       |
| Candidate replies   | FREE              | 0 MAD            |
| Follow-up messages  | FREE (within 24h) | 0 MAD            |
| Platform fees       | Meta Cloud API    | 0 MAD            |
| **TOTAL**           |                   | **25 MAD/month** |

#### Medium Scale (500 candidates/month)

| Activity                 | Calculation    | Monthly Cost      |
| ------------------------ | -------------- | ----------------- |
| 500 initial messages     | 500 × 0.50 MAD | **250 MAD**       |
| All replies & follow-ups | FREE           | 0 MAD             |
| **TOTAL**                |                | **250 MAD/month** |

#### Large Scale (2,000 candidates/month)

| Activity                 | Calculation      | Monthly Cost        |
| ------------------------ | ---------------- | ------------------- |
| 2,000 initial messages   | 2,000 × 0.50 MAD | **1,000 MAD**       |
| All replies & follow-ups | FREE             | 0 MAD               |
| **TOTAL**                |                  | **1,000 MAD/month** |

### 📊 Cost Comparison: vs SMS Providers

| Volume           | WhatsApp Direct  | Twilio SMS  | D7 Networks SMS | Savings                      |
| ---------------- | ---------------- | ----------- | --------------- | ---------------------------- |
| 500 msgs         | **250 MAD**      | 900 MAD     | 145 MAD         | WhatsApp cheaper than Twilio |
| 2,000 msgs       | **1,000 MAD**    | 3,600 MAD   | 580 MAD         | D7 SMS still cheaper         |
| **With Replies** | **FREE replies** | Pay per SMS | Pay per SMS     | **Huge advantage**           |

**💡 Key Insight:** WhatsApp becomes extremely cost-effective for **two-way conversations** (replies are FREE). SMS charges for every message!

---

## 🛠️ Technical Stack Readiness

### Core Technologies

| Component      | Technology    | Version  | Purpose                       |
| -------------- | ------------- | -------- | ----------------------------- |
| **Runtime**    | Node.js       | v20+ LTS | Backend server                |
| **Database**   | MongoDB Atlas | Latest   | Store conversations & history |
| **Real-time**  | Socket.io     | v4.x     | Live UI updates               |
| **API Client** | Axios         | v1.x     | Call Meta WhatsApp API        |
| **Webhooks**   | Express       | v4.x     | Receive incoming messages     |
| **Local Dev**  | ngrok         | Latest   | Expose local webhooks         |

### Required NPM Packages

```bash
npm install express socket.io mongoose axios dotenv
npm install --save-dev nodemon
```

### Environment Setup (.env)

```env
# Meta WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_permanent_system_user_token
WHATSAPP_VERIFY_TOKEN=your_custom_webhook_verification_token

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recruitment

# Server
PORT=3000
NODE_ENV=development

# Webhook (Production)
WEBHOOK_URL=https://yourdomain.com/webhook/whatsapp
```

### MongoDB Schema (Conversations)

```javascript
{
  _id: ObjectId,
  candidateId: String,          // Reference to candidate
  candidatePhone: String,        // +212XXXXXXXXX
  recruiterId: String,           // Recruiter who started chat
  jobPosition: String,           // Position applied for

  messages: [
    {
      messageId: String,         // WhatsApp message ID
      from: String,              // 'recruiter' | 'candidate'
      text: String,              // Message content
      timestamp: Date,
      status: String,            // 'sent' | 'delivered' | 'read' | 'failed'
      type: String               // 'text' | 'template' | 'image' | 'document'
    }
  ],

  conversationStatus: String,    // 'active' | 'closed' | 'pending'
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints (Express)

```javascript
// Send initial message
POST /api/recruitment/send-whatsapp
Body: { candidateId, candidatePhone, jobPosition, recruiterMessage }

// Receive webhook from Meta
POST /webhook/whatsapp
Headers: { x-hub-signature-256: "signature" }

// Get conversation history
GET /api/recruitment/conversation/:candidateId

// Mark message as read
POST /api/recruitment/mark-read/:messageId
```

### WebSocket Events (Socket.io)

```javascript
// Client subscribes to candidate conversation
socket.on("subscribe:candidate", { candidateId });

// Server emits when new message arrives
socket.emit("message:received", { candidateId, message });

// Server emits status updates
socket.emit("message:status", { messageId, status: "delivered" });
```

---

## 🔒 Compliance & Privacy (2026 Update)

### Business-Scoped User IDs (BSUID)

**Important Change in 2026:**
Meta now uses **Business-Scoped User IDs** instead of phone numbers for candidate privacy.

**What This Means:**

- Each candidate gets a unique `BSUID` per business
- Different businesses cannot correlate candidates across platforms
- Candidate phone number stays private
- We can still send/receive messages normally

**Implementation:**

```javascript
// Meta webhook provides BSUID
{
  "from": "BSUID:1234567890abcdef",  // ← Use this for replies
  "phone": "+212XXXXXXXXX",           // ← Only visible to you
  "message": "Hello, interested in the job"
}
```

### GDPR & Morocco Data Protection

**Required Actions:**

- ✅ Add "WhatsApp consent" checkbox to candidate application forms
- ✅ Store consent timestamp in MongoDB
- ✅ Provide "opt-out" mechanism (candidate can request to stop messages)
- ✅ Delete conversation data on candidate request (right to be forgotten)

**Consent Text Example:**

```
☑️ I consent to receive recruitment updates via WhatsApp from Linkopus.
   I understand I can opt-out anytime by replying "STOP".
```

### Message Retention Policy

**Recommendation:**

- Keep conversation history for **90 days**
- Archive important conversations (job offers, acceptances)
- Automatically delete old conversations (GDPR compliance)

---

## 🚀 Development Workflow

### Phase 1: Setup & Testing (Week 1)

1. Complete Meta Business verification
2. Set up MongoDB Atlas cluster
3. Create basic Express server with webhook endpoint
4. Test sending template message to team members
5. Verify webhook receives incoming messages

### Phase 2: Core Features (Week 2-3)

1. Implement recruiter UI (send message button)
2. Build conversation storage in MongoDB
3. Set up Socket.io for real-time updates
4. Test two-way messaging
5. Add message status tracking (sent/delivered/read)

### Phase 3: Production Ready (Week 4)

1. Deploy to production server
2. Configure production webhook URL
3. Implement error handling & logging
4. Add message retry logic
5. Set up monitoring & alerts

### Phase 4: Enhancement (Ongoing)

1. Add support for images/documents
2. Implement conversation templates
3. Add analytics dashboard
4. Build recruiter response time metrics

---

## 📋 Meeting Action Items

### Immediate (This Week)

- [ ] **Business Team:** Start Meta Business verification (RC + Tax ID)
- [ ] **IT Team:** Acquire new phone number for WhatsApp Business API
- [ ] **Recruitment Team:** Draft 3-5 message templates for approval

### Next Week

- [ ] **Dev Team:** Set up MongoDB Atlas and Node.js project
- [ ] **Dev Team:** Create Meta Business App and get API credentials
- [ ] **Dev Team:** Submit templates to Meta for approval

### Week 3-4

- [ ] **Dev Team:** Build and test microservice
- [ ] **Recruitment Team:** Test with 10 pilot candidates
- [ ] **All Teams:** Review results and iterate

---

## 🎯 Success Metrics

**Track These KPIs:**

| Metric                      | Target   | Measurement                        |
| --------------------------- | -------- | ---------------------------------- |
| **Template Approval Rate**  | 100%     | All templates approved first try   |
| **Message Delivery Rate**   | >98%     | Messages successfully delivered    |
| **Candidate Response Rate** | >60%     | Candidates reply within 24h        |
| **Average Response Time**   | <2 hours | Recruiter replies to candidates    |
| **Cost per Candidate**      | <1 MAD   | Total WhatsApp cost per candidate  |
| **Conversion Rate**         | Track    | Candidates who respond → interview |

---

## 💡 Key Takeaways for Management

### ✅ Advantages of This Approach

1. **Ultra-Low Cost:** Only pay 0.50 MAD for first message, all replies FREE
2. **No Platform Fees:** Meta Cloud API is completely free (0 MAD/month)
3. **Candidate Preference:** Most people prefer WhatsApp over email/SMS
4. **Real-time Communication:** Instant messaging improves response rates
5. **Full Control:** Direct API access, no third-party dependencies
6. **Scalable:** Can handle 10 or 10,000 candidates with same infrastructure

### ⚠️ Considerations

1. **Setup Time:** 2-7 days for Meta Business verification
2. **Template Approval:** Need to plan messages in advance for first contact
3. **Phone Number:** Must dedicate a clean number (cannot use personal WhatsApp)
4. **Development:** Requires 3-4 weeks to build and test properly

### 💰 Budget Summary

| Item                       | One-Time Cost | Monthly Cost      |
| -------------------------- | ------------- | ----------------- |
| Meta Business API          | 0 MAD         | 0 MAD             |
| Phone Number               | ~50 MAD       | ~20 MAD           |
| MongoDB Atlas (Shared)     | 0 MAD         | 0 MAD (Free tier) |
| Server Hosting             | 0 MAD\*       | ~100 MAD\*        |
| WhatsApp Messages (500/mo) | -             | ~250 MAD          |
| **TOTAL**                  | **~50 MAD**   | **~370 MAD**      |

\*Can use existing infrastructure

**vs Third-Party Provider (Twilio/Infobip):**

- Third-party: ~600-800 MAD/month for 500 messages
- **Our solution: ~370 MAD/month**
- **Savings: ~300-430 MAD/month (45-55% cheaper)**

---

## 📞 Questions & Support

**Meta WhatsApp Business API Documentation:**

- [Getting Started Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)

**Need Help?**

- Meta Business Support: [business.facebook.com/help](https://business.facebook.com/help)
- WhatsApp Business API Forum: [developers.facebook.com/community](https://developers.facebook.com/community)

---

**Document Status:** Ready for Team Review  
**Next Update:** After Phase 0 completion  
**Owner:** Development Team  
**Reviewed by:** ****\_\_\_**** (Sign off after meeting)

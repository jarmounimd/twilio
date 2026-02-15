# 📊 WhatsApp Integration Strategy: Recruitment Platform 2026

**Objective**: To provide a professional, 1-on-1 messaging experience between recruiters and candidates while maintaining total data separation.

---

## 🛠️ Case 1: Direct Client Number (Embedded Signup)

### The Concept
The client connects their own business number to our platform.

### The "Pop-up" Experience
We use **Meta's Embedded Signup**. It is a secure, 4-step wizard that stays on our site.

### 📱 What the Pop-up Looks Like:

1. **Login**: Client logs into their Facebook (to prove they represent the business)
2. **Selection**: They select their "Meta Business Portfolio" (Company profile)
3. **Number Entry**: They type the phone number they want to use
4. **Verification**: Meta sends a 6-digit code (SMS/Voice) to that number. The client enters it, and the pop-up closes. That's it.

### ✅ Pros & ⚠️ Cons:

| ✅ Pros | ⚠️ Cons |
|---------|---------|
| The client "owns" the identity; the number is theirs | **The "Clean Number" Problem**: If they already use this number on the WhatsApp App, they must delete the account from their phone first. It cannot live in both places. |

---

## 🛠️ Case 2: LinkoJob Virtual Number (The "Proxy" Solution)

### The Concept
LinkoJob provides a dedicated Moroccan (+212) virtual number for the client.

### How it handles "Trust"
To ensure candidates know who is calling, the profile is set up as:
- **Name**: [Recruiter Name] from [Client Company]
- **Provider**: Powered by LinkoJob

### 🚀 Implementation Steps:

1. **Instant Provisioning**: Client clicks "Activate Recruitment Line"
2. **Branding**: We automatically set the WhatsApp Profile Picture to the Client's Logo and the name to "Company X Recruitment"
3. **Representative Status**: We include a mandatory first message: 
   > "Hi, I'm [Name] from [Company]. I'm contacting you via our LinkoJob portal regarding your application."

### ✅ Pros & ⚠️ Cons:

| ✅ Pros | Details |
|---------|---------|
| **Zero Friction** | The client doesn't have to delete their personal WhatsApp. They can keep their private phone and use our dashboard for work. |
| **Data Security** | If a recruiter leaves the company, the company keeps the number and all candidate history on our platform. |

---

## 🛠️ Case 3: The "Groups" Logic (Investigation)

### The Concept
Using a single LinkoJob number and creating a new Group for every Candidate/Client pair.

### 📉 Investigation Findings (Why this is difficult):

| Issue | Explanation |
|-------|-------------|
| **No "Direct Add"** | Per Meta 2026 API rules, you cannot force a candidate into a group. You must send them a link, and they must click "Join." |
| **High Friction** | Candidates are unlikely to join a group just to talk to a recruiter. It feels like "extra work." |
| **API Limits** | Groups created via API have strict participant limits and do not support "Template Messages" (the required first message for businesses). |

---

## 📈 Comparison Summary for Decision

| Feature | Case 1: Client Number | Case 2: Virtual Number | Case 3: Groups |
|---------|------------------------|------------------------|----------------|
| **Setup Ease** | Medium (Requires 2FA/Docs) | **High (One-click)** | Low (Invite Link) |
| **Candidate Trust** | High | High (with proper branding) | Low |
| **Complexity** | Low | **Low** | Very High |
| **Client Requirement** | Must delete existing WA App | **None** | None |

---

## 🔗 Reference Links & Costs (Rest of Africa/Morocco 2026)

### 📋 Administrative Requirements

**Required Docs**: 
- RC (Registre du Commerce)
- Tax ID (IF/ICE)
- Utility Bill matching the address

**Status**: LinkoJob must be a verified Meta Tech Provider

---

### 💰 Estimated Costs

| Item | Cost (USD) | Cost (MAD) | Frequency |
|------|------------|------------|-----------|
| **Virtual Number (+212)** | ~$1.00 | ~10.50 MAD | Monthly |
| **Messaging (Meta Fee)** | | | |
| - Marketing/Outreach | ~$0.038 | ~0.40 MAD | Per delivered message |
| - Service/Replies | $0.00 | **FREE** | Within 24h window |

---

## 🌐 Official Resources

- **Meta Cloud API Documentation**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **WhatsApp Embedded Signup Flow**: https://developers.facebook.com/docs/whatsapp/embedded-signup

---

## 🎯 Recommended Approach

**Case 2: Virtual Number** is the optimal solution because:

✅ **Lowest friction** for clients  
✅ **Professional branding** with client logo  
✅ **Data ownership** stays with platform  
✅ **No personal WhatsApp conflicts**  
✅ **Scalable** for hundreds of clients  
✅ **Cost-effective** at ~11.55 MAD/month per client


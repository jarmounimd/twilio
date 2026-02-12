# 📊 Recruitment Platform: WhatsApp Dedicated Number Strategy (2026)

**Goal**: To assign a unique, branded WhatsApp number to every client company automatically. This ensures that candidate conversations never collide and provides a 100% professional experience for recruiters.

---

## 🏛️ 1. THE META CLOUD SOLUTION

We will integrate with the **Official WhatsApp Cloud API**. This is a server-to-server connection hosted by Meta.

**Scalability**: We can host hundreds of unique +212 numbers under our single company portfolio.

**Compliance**: Zero risk of "bot bans" because we are using official business channels.

**Privacy**: Ready for the June 2026 BSUID update, ensuring candidate data is physically separated between clients.

---

## 💼 2. CEO CHECKLIST: ACCOUNT & VERIFICATION

To act as a "Technical Provider" and manage numbers for our clients, our company must be verified by Meta.

### Steps to Get Ready:

1. **Create Portfolio**: Create a Meta Business Account at https://business.facebook.com

2. **Submit Documents**: Upload these Moroccan legal papers to the "Security Center":
   - **RC (Registre du Commerce)**: To prove legal existence
   - **Tax ID (IF/ICE)**: To verify tax status in Morocco
   - **Utility Bill**: (Water/Electricity) to verify our physical address

**Timeline**: Verification usually takes 2–5 business days. Once verified, our initial limit of 2 numbers will jump to 20 numbers, and can be increased to unlimited via a support ticket.

---

## 💰 3. COST BREAKDOWN (Morocco 2026)

We handle all technical payments to make the service "Invisible" for our clients.

### A. Number Procurement (Monthly Rental)

We use a virtual provider with a REST API (like Telnyx) to buy numbers programmatically the moment a client signs up.

| Item | Cost (USD) | Cost (MAD) | Frequency |
|------|------------|------------|-----------|
| Moroccan Virtual Mobile (+212) | $1.00 | ~10.50 MAD | Monthly |
| SMS/Voice Capability | $0.10 | ~1.05 MAD | Monthly |
| **Total per Client** | **$1.10** | **~11.55 MAD** | **Monthly** |

### B. Messaging Fees (Usage)

We pay only for the messages actually delivered. Morocco is in the "Rest of Africa" regional tier.

| Action | Meta Category | Cost (MAD) |
|--------|---------------|------------|
| Recruiter reaches out | Utility Template | ~0.05 MAD |
| Candidate replies | Service Message | **FREE** |
| Rolling 24h Chat | Service Message | **FREE** |

---

## 🛠️ 4. THE PROVISIONING PIPELINE (Microservice Flow)

As a developer, I will build an automated pipeline that triggers the moment a client purchases a "Recruitment Pack."

1. **Procurement**: The microservice calls the Telnyx API to purchase a new Moroccan number.

2. **Meta Linkage**: The service calls Meta's `/phone_numbers` endpoint to add that number to our Business Account.

3. **Automated OTP**:
   - We request a 6-digit verification code from Meta via Voice Call
   - The microservice "listens" to the Telnyx call log API to catch the 6-digit code automatically
   - The service submits the code to Meta to activate the line

4. **Routing Entry**: We save the new `phone_number_id` in our MongoDB linked to the `Company_ID`.

---

## 🏗️ 5. MULTI-TENANT WEBHOOK ROUTING

Since Meta sends all candidate replies to one single Webhook URL, the microservice will perform "Traffic Control":

**Step 1**: Meta sends a JSON payload to our `/webhook`.

**Step 2**: Microservice extracts the `metadata.phone_number_id`.

**Step 3**: System queries MongoDB to see which company owns that specific ID.

**Step 4**: System uses Socket.io to push the candidate's message only to that company's recruiters.

**Result**: Companies are 100% isolated. They get a dedicated, branded identity for only ~11.50 MAD/month plus a few centimes per candidate contacted.

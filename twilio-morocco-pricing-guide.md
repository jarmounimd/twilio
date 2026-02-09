# Twilio Pricing Guide for Morocco

**Purpose**: This document provides a comprehensive overview of Twilio's pricing structure and key concepts for Morocco to support informed team decision-making on communication channels for our application.

---

## Key Terms

### Communication Direction

- **Outbound**: Messages or calls initiated by your application to end users (you send)
- **Inbound**: Messages or calls received by your application from end users (they send to you)

### SMS Concepts

- **Segment**: A single SMS unit containing up to 160 GSM-7 characters or 70 Unicode characters. Messages exceeding these limits are split into multiple segments, each charged separately.

### Use Cases by Channel

**SMS**

- Two-factor authentication (2FA) codes
- Order confirmations and delivery notifications
- Password reset links
- Promotional campaigns
- Appointment reminders

**Voice**

- Customer support hotlines
- Automated voice responses (IVR)
- Verification calls with PIN codes
- Conference calling
- Click-to-call features

**WhatsApp**

- Rich media customer support (images, documents)
- Order status updates with tracking
- Interactive product catalogs
- Transactional notifications within 24-hour windows
- Marketing campaigns (requires opt-in)

---

## Morocco Pricing Summary (USD)

### SMS Pricing

| Direction | Price per Segment |
| --------- | ----------------- |
| Outbound  | $0.0695           |
| Inbound   | $0.0075           |

**Note**: Messages are charged per segment. A message with 161-320 characters counts as 2 segments.

### Voice Pricing (Elastic SIP Trunking)

| Call Type        | Price per Minute |
| ---------------- | ---------------- |
| Local (Landline) | $0.4703          |
| Mobile           | $0.8295          |
| Inbound          | $0.0085          |

### WhatsApp Pricing

| Component                    | Price                    |
| ---------------------------- | ------------------------ |
| Twilio Fee (per message)     | $0.0050                  |
| Meta Marketing Template      | $0.0330                  |
| Meta Utility Template        | $0.0120                  |
| Meta Authentication Template | $0.0070                  |
| Service Conversations        | Free (within 24h window) |

**Customer Service Window**: Inbound user messages open a 24-hour window for free responses. After this window, template messages with Meta fees apply.

---

## What This Means for Our App

### Real-World Scenarios

**SMS Use Case: 2FA Code**

- 1 verification SMS (1 segment): **$0.0695**
- If user replies, inbound: **$0.0075**
- Total cost per verification cycle: **~$0.077**

**Voice Use Case: OTP Verification Call**

- 30-second call to mobile: **$0.4148** (0.5 min × $0.8295)
- More expensive than SMS for simple verification

**WhatsApp Use Case: Order Confirmation**

- Initial template message (utility): **$0.0170** ($0.005 Twilio + $0.012 Meta)
- Customer replies: Opens 24h free window
- Follow-up messages within 24h: **$0.0050** (Twilio fee only)
- Response after 24h: **$0.0170** (requires new template)

**Cost Comparison: 1,000 Verifications**

| Channel  | Method                  | Cost    |
| -------- | ----------------------- | ------- |
| SMS      | Standard OTP            | $69.50  |
| Voice    | 30-sec call to mobile   | $414.75 |
| WhatsApp | Authentication template | $12.00  |

---

## Quick Reference: Cost Comparison Matrix

| Metric                       | SMS           | Voice          | WhatsApp                  |
| ---------------------------- | ------------- | -------------- | ------------------------- |
| **Best For**                 | Codes, alerts | Urgent support | Rich interactions         |
| **Typical Cost/Transaction** | $0.07-$0.10   | $0.40-$0.80    | $0.01-$0.02               |
| **User Preference**          | High          | Medium         | Very High                 |
| **Delivery Speed**           | Seconds       | Immediate      | Seconds                   |
| **Media Support**            | No            | Voice only     | Yes (images, docs, video) |

### Recommendations

1. **Use WhatsApp** for authentication/OTP → Lowest cost ($0.012/verification)
2. **Use SMS** as fallback for users without WhatsApp → Moderate cost ($0.0695/message)
3. **Limit Voice** to high-priority customer support → Highest cost ($0.47-$0.83/min)
4. **Leverage 24h WhatsApp windows** for customer service conversations → Free responses
5. **Optimize SMS length** to stay within 160 characters → Avoid multi-segment charges

---

**Last Updated**: February 2026  
**Source**: Twilio Official Pricing Documentation

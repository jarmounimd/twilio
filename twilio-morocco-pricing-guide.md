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

## Morocco Pricing Summary (MAD)

### SMS Pricing

| Direction | Price per Segment |
| --------- | ----------------- |
| Outbound  | 0.70 MAD          |
| Inbound   | 0.08 MAD          |

**Note**: Messages are charged per segment. A message with 161-320 characters counts as 2 segments.

### Voice Pricing

**What is this**: Phone call costs when your app makes or receives calls using Twilio's voice service

| Call Type                             | Price per Minute | Description                                                 |
| ------------------------------------- | ---------------- | ----------------------------------------------------------- |
| **Outbound to Landline** (fixed line) | 4.70 MAD         | Calling home/office phones (cheaper)                        |
| **Outbound to Mobile** (cell phones)  | 8.30 MAD         | Calling mobile/cell phones (more expensive, almost 2x cost) |
| **Inbound** (receiving calls)         | 0.09 MAD         | Someone calls your Twilio number                            |

### WhatsApp Pricing

**How it works**: Every WhatsApp message costs **Twilio Fee (0.05 MAD) + Meta Fee** (depends on message type)

| Message Type                     | Twilio Fee | Meta Fee | **Total Cost** |
| -------------------------------- | ---------- | -------- | -------------- |
| **Marketing** (promotions, ads)  | 0.05 MAD   | 0.33 MAD | **0.38 MAD**   |
| **Utility** (order updates, etc) | 0.05 MAD   | 0.12 MAD | **0.17 MAD**   |
| **Authentication** (OTP, codes)  | 0.05 MAD   | 0.07 MAD | **0.12 MAD**   |
| **Service Reply** (within 24h)   | 0.05 MAD   | Free     | **0.05 MAD**   |

**Customer Service Window**: When a user messages you first, you have 24 hours to reply for free (only 0.05 MAD Twilio fee, no Meta fee). After 24 hours, you must use templates with Meta fees.

---

## Quick Reference: Cost Comparison Matrix

| Metric                       | SMS           | Voice          | WhatsApp                  |
| ---------------------------- | ------------- | -------------- | ------------------------- |
| **Best For**                 | Codes, alerts | Urgent support | Rich interactions         |
| **Typical Cost/Transaction** | 0.70-1.00 MAD | 4.00-8.00 MAD  | 0.10-0.20 MAD             |
| **User Preference**          | High          | Medium         | Very High                 |
| **Delivery Speed**           | Seconds       | Immediate      | Seconds                   |
| **Media Support**            | No            | Voice only     | Yes (images, docs, video) |

---

**Last Updated**: February 2026  
**Source**: Twilio Official Pricing Documentation

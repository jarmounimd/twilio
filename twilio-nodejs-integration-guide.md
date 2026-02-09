# Twilio Integration Guide - Node.js/TypeScript

Quick implementation guide for integrating Twilio into your Node.js application with TypeScript.

---

## Setup Steps

### 1. Get Twilio Account & Credentials

1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Verify your email and phone number
3. Get your credentials from the [Twilio Console](https://console.twilio.com):
   - **Account SID** (like: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** (keep this secret!)
4. Purchase a phone number:
   - Go to **Phone Numbers** → **Buy a Number**
   - Choose Morocco (+212) number with SMS/Voice/WhatsApp capabilities
   - Note your Twilio phone number

### 2. Install Twilio SDK

```bash
npm install twilio
npm install --save-dev @types/node
```

### 3. Environment Variables

Create `.env` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+212XXXXXXXXX
```

---

## Code Examples

### Initialize Twilio Client

```typescript
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
```

---

## 1. Send SMS (0.70 MAD per message)

**Use Case**: Send verification codes, order confirmations

```typescript
async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to, // Format: +212XXXXXXXXX
    });

    console.log(`SMS sent! SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error("SMS Error:", error);
    throw error;
  }
}

// Example usage
sendSMS("+212612345678", "Your verification code is: 123456");
```

**Cost**: 0.70 MAD per SMS (one segment = 160 characters)

---

## 2. Make Voice Call (4.70-8.30 MAD per minute)

**Use Case**: OTP verification calls, customer support

```typescript
async function makeVoiceCall(to: string, message: string) {
  try {
    const call = await client.calls.create({
      twiml: `<Response><Say language="fr-FR">${message}</Say></Response>`,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log(`Call initiated! SID: ${call.sid}`);
    return call;
  } catch (error) {
    console.error("Call Error:", error);
    throw error;
  }
}

// Example usage
makeVoiceCall("+212612345678", "Votre code de vérification est 1 2 3 4 5 6");
```

**Cost**: 4.70 MAD/min (landline) or 8.30 MAD/min (mobile)

---

## 3. Send WhatsApp Message (0.12-0.38 MAD per message)

**Use Case**: Rich notifications with images, order updates

### Setup WhatsApp

1. Go to Twilio Console → **Messaging** → **WhatsApp**
2. Enable WhatsApp Sandbox for testing
3. Send `join <your-sandbox-code>` to the sandbox number from your WhatsApp

### Send WhatsApp Message

```typescript
async function sendWhatsApp(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${to}`, // Format: whatsapp:+212XXXXXXXXX
    });

    console.log(`WhatsApp sent! SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error("WhatsApp Error:", error);
    throw error;
  }
}

// Example usage
sendWhatsApp("+212612345678", "🎉 Your order #12345 has been shipped!");
```

### Send WhatsApp with Image

```typescript
async function sendWhatsAppWithImage(
  to: string,
  message: string,
  imageUrl: string,
) {
  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${to}`,
      mediaUrl: [imageUrl],
    });

    console.log(`WhatsApp with image sent! SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error("WhatsApp Error:", error);
    throw error;
  }
}

// Example usage
sendWhatsAppWithImage(
  "+212612345678",
  "Here is your receipt:",
  "https://example.com/receipt.jpg",
);
```

**Cost**:

- Authentication message: 0.12 MAD
- Utility message: 0.17 MAD
- Marketing message: 0.38 MAD

---

## Complete Example: Full Service Class

```typescript
import twilio from "twilio";

class TwilioService {
  private client: twilio.Twilio;
  private phoneNumber: string;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    );
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER!;
  }

  // Send verification code via SMS
  async sendVerificationCode(phoneNumber: string, code: string) {
    return await this.client.messages.create({
      body: `Your verification code is: ${code}`,
      from: this.phoneNumber,
      to: phoneNumber,
    });
  }

  // Send WhatsApp notification
  async sendWhatsAppNotification(phoneNumber: string, orderNumber: string) {
    return await this.client.messages.create({
      body: `✅ Order #${orderNumber} confirmed! We'll notify you when it ships.`,
      from: `whatsapp:${this.phoneNumber}`,
      to: `whatsapp:${phoneNumber}`,
    });
  }

  // Make verification call
  async makeVerificationCall(phoneNumber: string, code: string) {
    const digits = code.split("").join(" ");
    return await this.client.calls.create({
      twiml: `<Response><Say language="fr-FR">Votre code est ${digits}</Say></Response>`,
      from: this.phoneNumber,
      to: phoneNumber,
    });
  }
}

// Usage
const twilioService = new TwilioService();

// Send SMS OTP
await twilioService.sendVerificationCode("+212612345678", "123456");

// Send WhatsApp notification
await twilioService.sendWhatsAppNotification("+212612345678", "ORD-12345");
```

---

## Quick Cost Reference

| Action              | Code Method                           | Cost (MAD) |
| ------------------- | ------------------------------------- | ---------- |
| Send SMS            | `client.messages.create()`            | 0.70       |
| WhatsApp Auth       | `client.messages.create()` (whatsapp) | 0.12       |
| Voice Call (mobile) | `client.calls.create()`               | 8.30/min   |

---

## Testing

### Test SMS

```bash
curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json \
  --data-urlencode "Body=Test message" \
  --data-urlencode "From=$TWILIO_PHONE_NUMBER" \
  --data-urlencode "To=+212612345678" \
  -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
```

### Check Message Status

```typescript
async function checkMessageStatus(messageSid: string) {
  const message = await client.messages(messageSid).fetch();
  console.log(`Status: ${message.status}`);
  // Status can be: queued, sent, delivered, failed
}
```

---

## Error Handling Best Practices

```typescript
async function sendSMSWithRetry(to: string, message: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: to,
      });

      return result;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw new Error(`Failed to send SMS after ${maxRetries} attempts`);
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

---

## Resources

- **Twilio Console**: [console.twilio.com](https://console.twilio.com)
- **Node.js SDK Docs**: [twilio.com/docs/libraries/node](https://www.twilio.com/docs/libraries/node)
- **API Reference**: [twilio.com/docs/api](https://www.twilio.com/docs/api)
- **Pricing Calculator**: [twilio.com/pricing](https://www.twilio.com/pricing)

---

**Ready to integrate!** Start with SMS (easiest), then move to WhatsApp (best value), and add Voice if needed.

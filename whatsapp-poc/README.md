# WhatsApp Embedded Signup POC

Simple proof of concept to test the Meta WhatsApp Embedded Signup flow.

## Project Structure

```
whatsapp-poc/
├── server.js         # Main server with 5 endpoints
├── package.json      # Dependencies
├── .env.example      # Environment template
├── .env              # Your credentials (create this)
└── README.md         # This file
```

## Next Steps

### 1. Install Dependencies
```bash
cd whatsapp-poc
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
copy .env.example .env

# Then edit .env and fill in your Meta credentials:
# - META_APP_ID (from developers.facebook.com)
# - META_APP_SECRET (from developers.facebook.com)
# - VERIFY_TOKEN (any random string you choose)
```

### 3. Start the Server
```bash
npm start
```

### 4. Expose with ngrok
Open a new terminal and run:
```bash
ngrok http 3000
```

Copy the https URL (e.g., `https://abc123.ngrok.io`)

### 5. Configure Meta Webhook
Go to Meta Business Manager → Your App → WhatsApp → Configuration:
- Callback URL: `https://abc123.ngrok.io/webhook`
- Verify Token: (same as in your .env file)
- Subscribe to: messages

### 6. Test Embedded Signup
The OAuth URL format:
```
https://www.facebook.com/v21.0/dialog/oauth?
  client_id=YOUR_APP_ID
  &redirect_uri=https://abc123.ngrok.io/embedded-signup
  &response_type=code
  &scope=whatsapp_business_management,whatsapp_business_messaging
```

### 7. Test Sending Messages
```
http://localhost:3000/test-send?clientId=CLIENT_ID&to=212XXXXXXXXX&message=Hello
```

### 8. View Connected Clients
```
http://localhost:3000/clients
```

## Endpoints

- `GET /webhook` - Meta webhook verification
- `POST /webhook` - Receive WhatsApp messages
- `POST /embedded-signup` - OAuth callback handler
- `GET /test-send` - Send test message
- `GET /clients` - List connected clients

## Important Notes

- This is a POC - uses in-memory storage (Map)
- For production: Replace Map with MongoDB
- Add token encryption
- Add webhook signature verification
- Implement token refresh logic
- Add proper error handling
